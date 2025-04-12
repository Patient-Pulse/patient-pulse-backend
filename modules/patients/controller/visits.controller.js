import {
  addVisitSchema,
  updateVisitSchema,
} from "../validator/patient.validator.js";

import {
  fetchVisitById,
  fetchVisitsByPatientId,
} from "../dbo/visits.dbo.js";

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../utils/respHandler.js";

import { fetchPatients } from "../dbo/patients.dbo.js";

import { resendEmailProvider } from '../../../utils/resendEmailProvider.emailer.js';

import db from "../../../config/knex.js";
import { nanoid } from "nanoid";

// controllers/visits.controller.js
export const addVisit = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { body, user_id, clinic_id, user_role } = req;

    const { error, value } = addVisitSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return sendErrorResponse(
        res,
        {
          code: "VALIDATION_ERROR",
          message: error.details.map((err) => err.message).join(", "),
        },
        process.env.NODE_ENV
      );
    }

    let doctor_id = null;
    if (user_role === 'doctor') {
      doctor_id = user_id;
    } else if (user_role != 'doctor' && value.doctor_id) {
      doctor_id = value.doctor_id;
    } else {
      return res.status(400).json({
        status: "error",
        message: "Doctor ID is required when creating a patient as staff",
      });
    }

    // Extract medications from the request
    const { medications, ...visitData } = value;

    const visitId = nanoid();

    // Create visit and prescriptions in a transaction
    await db.transaction(async trx => {
      // 1. Insert the visit without medications_prescribed field
      await trx("patient_visits")
      .insert({
        id: visitId,
        clinic_id,
        patient_id: patientId,
        ...visitData,
        doctor_id,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      // 2. Insert medications if they exist
      if (medications && medications.length > 0) {
        await trx("prescribed_medicines")
          .insert(medications.map(med => ({
            id: nanoid(),
            visit_id: visitId,
            clinic_medicine_id: med.clinic_medicine_id,
            global_medicine_id: med.global_medicine_id,
            medicine_name: med.medicine_name,
            dosage: med.dosage,
            formulation: med.formulation,
            quantity: med.quantity,
            frequency: med.frequency,
            after_meal: med.after_meal,
            instructions: med.instructions,
            is_custom: med.is_custom || false,
            created_at: db.fn.now()
          })));
      }
    });

    return sendSuccessResponse(res, 201, "Visit added successfully", {
      visit_id: visitId,
    });
  } catch (err) {
    console.error("Error in addVisit:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};

export const editVisit = async (req, res) => {
  try {
    const { patientId, visitId } = req.params;
    const { body } = req;
    
    const { error, value } = updateVisitSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return sendErrorResponse(
        res,
        {
          code: "VALIDATION_ERROR",
          message: error.details.map((err) => err.message).join(", "),
        },
        process.env.NODE_ENV
      );
    }

    const { medications, ...visitData } = value;

    await db.transaction(async trx => {
      // 1. Update the visit data
      await trx("patient_visits")
        .where({ id: visitId, patient_id: patientId })
        .update({
          ...visitData,
          updated_at: db.fn.now()
        });

      // 2. Delete existing medications for this visit
      await trx("prescribed_medicines")
        .where("visit_id", visitId)
        .del();

      // 3. Insert new medications
      if (medications && medications.length > 0) {
        await trx("prescribed_medicines")
          .insert(medications.map(med => ({
            id: nanoid(),
            visit_id: visitId,
            clinic_medicine_id: med.clinic_medicine_id,
            global_medicine_id: med.global_medicine_id,
            medicine_name: med.medicine_name,
            dosage: med.dosage,
            formulation: med.formulation,
            quantity: med.quantity,
            frequency: med.frequency,
            after_meal: med.after_meal,
            instructions: med.instructions,
            is_custom: med.is_custom || false,
            created_at: db.fn.now()
          })));
      }
    });

    return sendSuccessResponse(res, 200, "Visit updated successfully");
  } catch (err) {
    console.error("Error in editVisit:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};

export const getVisitById = async (req, res) => {
  try {
    const { patientId, visitId } = req.params;

    const visit = await fetchVisitById(visitId, patientId);

    if (!visit) {
      return res.status(404).json({
        status: "error",
        message: "Visit not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: visit,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const getPatientVisits = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { user_id, clinic_id, user_role } = req;

    const patientVisits = await fetchVisitsByPatientId(patientId, user_role, user_id, clinic_id);

    if (!patientVisits) {
      return sendErrorResponse(res, 500, "Something went wrong.");
    }

    return sendSuccessResponse(res, 200, "Patient visits retrieved successfully", patientVisits);
  } catch (err) {
    return sendErrorResponse(
      res,
      500,
      "Internal Server Error",
      process.env.NODE_ENV === "development" ? err.message : undefined
    );
  }
};

export const sendEmail = async (req, res) => {
    const { patientId, visitId } = req.params;
    try {

        const patientOptions = {
            conditions: {
                id: patientId,
            },
            select: ["email"]
        };

        const patient = await fetchPatients(patientOptions);
      
        if (!patient || patient.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Patient not found",
            });
        }

        const visit = await fetchVisitById(visitId, patientId);
        if (!visit) {
            return sendErrorResponse(res, 404, "Visit not found");
        }

        const options = {
            from: 'team@patientpulse.tech',
            to: patient[0].email,
            ...visit  
        }

        const resp = resendEmailProvider(options)
        return sendSuccessResponse(res, 200, "Email sent successfully", resp);
    } catch(err) {
        console.log(err)
        return sendErrorResponse(res, 500, err.message, process.env.NODE_ENV === "development" ? err.message : undefined);
    }
}