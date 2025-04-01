import db from "../../../config/knex.js";
import { nanoid } from "nanoid";

export const insertVisit = async (patientId, visitdata, doctorId) => {
    const visitId = nanoid();
  console.log(doctorId);
    try {
        await db("patient_visits").insert({
          id: visitId, 
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
  
  export const findExistingPatientWithVisitId = async (visitId, patientId) => {
    try {
      const exists = await db("patient_visits")
        .where({ id: visitId, patient_id: patientId })
        .first();
  
      return !!exists;
    } catch (err) {
      throw err;
    }
  };
  
  export const updatePatientVisit = async (id, patientVisitData, userId) => {
    try {
      const updatedPatientVisit = await db("patient_visits")
        .where({"id": id, "doctor_id": userId})
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

  export const fetchVisitsByPatientId = async (patientId, doctorId) => {
    try {
      const rows = await db("patient_visits")
        .where({ patient_id: patientId, doctor_id: doctorId })
        .orderBy("created_at", "desc");
        
      return rows;
    } catch (err) {
      throw err;
    }
  }