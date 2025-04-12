import db from "../../../config/knex.js";
import { sendErrorResponse, sendSuccessResponse } from "../../../utils/respHandler.js";

export const createPrescription = async (req, res) => {
  try {
    const { clinic_id } = req;
    const { visit_id, medicines } = req.body;
    
    const visit = await db("patient_visits")
      .where({ id: visit_id, clinic_id })
      .first();

    if (!visit) {
      return res.status(404).json({
        status: "error",
        message: "Visit not found",
      });
    }

    const insertedMeds = await db.transaction(async (trx) => {
      const results = [];

      for (const med of medicines) {
        const [prescribed] = await trx("prescribed_medicines")
          .insert({
            visit_id,
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
          })
          .returning("*");

        results.push(prescribed);
      }

      return results;
    });

    return res.status(201).json({
      status: "success",
      data: insertedMeds,
    });
  } catch (err) {
    console.error("Error in createPrescription:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getVisitMedications = async (req, res) => {
  try {
    const { visitId } = req.params;
    
    const medications = await db("prescribed_medicines")
      .where("visit_id", visitId)
      .select("*");
    
    return sendSuccessResponse(res, 200, "Medications fetched successfully", medications);
  } catch (err) {
    console.error("Error in getVisitMedications:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};
