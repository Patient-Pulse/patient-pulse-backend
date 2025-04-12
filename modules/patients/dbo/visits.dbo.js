import db from "../../../config/knex.js";
import { nanoid } from "nanoid";

export const insertVisit = async (
  patientId,
  visitdata,
  doctorId,
  clinic_id
) => {
  const visitId = nanoid();

  try {
    await db("patient_visits").insert({
      id: visitId,
      clinic_id,
      patient_id: patientId,
      ...visitdata,
      doctor_id: doctorId,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
    return visitId;
  } catch (err) {
    throw err;
  }
};

export const findExistingPatientWithVisitId = async (
  visitId,
  patientId,
  clinicId
) => {
  try {
    const exists = await db("patient_visits")
      .where({ id: visitId, patient_id: patientId, clinic_id: clinicId })
      .first();

    return !!exists;
  } catch (err) {
    throw err;
  }
};

export const updatePatientVisit = async (id, patientVisitData) => {
  try {
    const updatedPatientVisit = await db("patient_visits")
      .where({ id: id })
      .update(patientVisitData)
      .returning("*");

    return updatedPatientVisit[0];
  } catch (err) {
    console.error("Error updating patient by ID in DB:", err);
    throw err;
  }
};

export const updatePatientVisitWithMedications = async (
  visitId,
  clinicId,
  visitData,
  medications,
  doctorId
) => {
  try {
    return await db.transaction(async (trx) => {
      // 1. Update the visit record
      await trx("patient_visits")
      .where({ id: visitId, clinic_id: clinicId })
      .update({
        ...visitData,
        doctor_id: doctorId,
        updated_at: db.fn.now(),
      })

      // 2. Handle medications if they were provided
      if (medications !== undefined) {
        // Delete existing medications for this visit
        await trx("prescribed_medicines").where({ visit_id: visitId }).delete();

        // Insert new medications if any were provided
        if (medications && medications.length > 0) {
          await trx("prescribed_medicines").insert(
            medications.map((med) => ({
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
              is_custom: med.is_custom,
              created_at: db.fn.now(),
            }))
          );
        }
      }

      // 3. Fetch the complete visit data with medications
      const visitWithMedications = await trx("patient_visits")
        .where({ id: visitId })
        .first();

      if (medications !== undefined) {
        visitWithMedications.medications = await trx("prescribed_medicines")
          .where({ visit_id: visitId })
          .select("*");
      }

      return visitWithMedications;
    });
  } catch (err) {
    console.error("Error in updatePatientVisitWithMedications:", err);
    throw err;
  }
};

export const fetchVisitById = async (visitId, patientId) => {
  try {
    const row = await db("patient_visits")
      .where({ id: visitId, patient_id: patientId })
      .first();

    return row;
  } catch (err) {
    throw err;
  }
};

export const fetchVisitsByPatientId = async (
  patientId,
  userRole,
  userId,
  clinicId
) => {
  try {
    let visitsQuery = db("patient_visits")
      .where("patient_id", patientId)
      .andWhere("clinic_id", clinicId)
      .orderBy("created_at", "desc");

    if (userRole === "doctor") {
      visitsQuery = visitsQuery.andWhere("doctor_id", userId);
    }

    const visits = await visitsQuery;

    if (visits.length > 0) {
      const visitIds = visits.map(visit => visit.id);
      
      const medications = await db("prescribed_medicines")
        .whereIn("visit_id", visitIds)
        .select("*");

      const medicationsByVisit = medications.reduce((acc, med) => {
        if (!acc[med.visit_id]) {
          acc[med.visit_id] = [];
        }
        acc[med.visit_id].push(med);
        return acc;
      }, {});

      return visits.map(visit => ({
        ...visit,
        medications: medicationsByVisit[visit.id] || []
      }));
    }
    
    return visits;
  } catch (err) {
    console.error("Error fetching patient visits:", err);
    throw err;
  }
};
