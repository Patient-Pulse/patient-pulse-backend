import {
  addVisitSchema,
  updateVisitSchema,
} from "../validator/patient.validator.js";

import {
  insertVisit,
  findExistingPatientWithVisitId,
  updatePatientVisit,
  fetchVisitById,
  fetchVisitsByPatientId
} from "../dbo/visits.dbo.js";

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../utils/respHandler.js";

import { fetchPatients } from "../dbo/patients.dbo.js";

import { resendEmailProvider } from '../../../utils/resendEmailProvider.emailer.js';

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

    const visitId = await insertVisit(patientId, value, doctor_id, clinic_id);

    return sendSuccessResponse(res, 201, "Visit added successfully", {
      visit_id: visitId,
    });
  } catch (err) {
    console.log(err)
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};

export const editVisit = async (req, res) => {
  try {
    const { visitId, patientId } = req.params;
    const { body, clinic_id } = req;

    const { error, value: validatedValue } = updateVisitSchema.validate(body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      return sendErrorResponse( res, {
          code: "VALIDATION_ERROR",
          message: error.details.map((err) => err.message).join(", "),
        }, process.env.NODE_ENV
      );
    }

    const existingPatient = await findExistingPatientWithVisitId(
      visitId,
      patientId,
      clinic_id
    );

    if (!existingPatient) {
      return sendErrorResponse(res, {
        code: "NOT_FOUND",
        message: "Patient with visit ID not found.",
      });
    }

    const updatedPatientVisit = await updatePatientVisit(
      visitId,
      validatedValue
    );

    return sendSuccessResponse(
      res,
      200,
      "Visit updated successfully",
      updatedPatientVisit
    );
  } catch (err) {
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