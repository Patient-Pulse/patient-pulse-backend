import db from "../../../config/knex.js";
import { nanoid } from "nanoid";

export const insertVisit = async (patientId, visitdata, doctorId, clinic_id) => {
    const visitId = nanoid();
  
    try {
        await db("patient_visits").insert({
          id: visitId, 
          clinic_id,
          patient_id : patientId,
          ...visitdata,
          doctor_id: doctorId,
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
        });
        return patientId;
    } catch(err) {
      throw err;
    }
  }
  
  export const findExistingPatientWithVisitId = async (visitId, patientId, clinicId) => {
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
        .where({"id": id})
        .update(patientVisitData)
        .returning("*");
  
      return updatedPatientVisit[0];
    } catch (err) {
      console.error("Error updating patient by ID in DB:", err);
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

  export const fetchVisitsByPatientId = async (patientId, userRole, userId, clinicId) => {
    try {
      let query = db("patient_visits")
        .where("patient_id", patientId)
        .andWhere("clinic_id", clinicId)
        .orderBy("created_at", "desc");
  
      if (userRole === "doctor") {
        query = query.andWhere("doctor_id", userId);
      }
  
      return await query;
    } catch (err) {
      console.error("Error fetching patient visits:", err);
      throw err;
    }
  };