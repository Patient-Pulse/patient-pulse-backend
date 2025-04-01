import db from "../../../config/knex.js";
import { nanoid } from "nanoid";

export const insertPatient = async (patientData, doctorId) => {
  const patientId = nanoid();

  try {
    await db("patients").insert({
      id: patientId,
      ...patientData,
      doctor_id: doctorId,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
    return patientId;
  } catch (err) {
    throw err;
  }
};

export const findExistingPatient = async (phone, email, doctorId) => {
  try {
    const query = db("patients").where({"phone": phone, doctor_id: doctorId});

    const finalQuery = email ? query.orWhere("email", email) : query;

    const result = await finalQuery.first();
    return result;
  } catch (err) {
    console.error("Error finding existing patient:", err);
    throw err;
  }
};

export const fetchPatientsWithPagination = async (
  page,
  limit,
  sortBy,
  sortOrder,
  search,
  gender,
  doctorId
) => {
  try {
    const offset = (page - 1) * limit;

    let query = db("patients")
      .select("*")
      .orderBy(sortBy, sortOrder)
      .offset(offset)
      .limit(limit);

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(function () {
        this.where("full_name", "like", searchTerm)
          .orWhere("phone", "like", searchTerm)
          .orWhere("email", "like", searchTerm);
      });
    }

    if (gender && ["male", "female", "other"].includes(gender)) {
      query = query.where("gender", gender);
    }

    if(doctorId) {
      query = query.where("doctor_id", doctorId);
    }

    return await query;
  } catch (err) {
    console.error("Error fetching patients from DB:", err);
    throw err;
  }
};

export const getTotalPatientCount = async (search, gender, doctorId) => {
  try {
    let query = db("patients").count("* as count");

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(function () {
        this.where("full_name", "like", searchTerm)
          .orWhere("phone", "like", searchTerm)
          .orWhere("email", "like", searchTerm);
      });
    }

    // Add gender filtering for count
    if (gender && ["male", "female", "other"].includes(gender)) {
      query = query.where("gender", gender);
    }

    if(doctorId) {
      query = query.where("doctor_id", doctorId);
    }

    const totalCount = await query.first();
    return totalCount.count;
  } catch (err) {
    console.error("Error getting patient count from DB:", err);
    throw err;
  }
};

export const fetchPatientById = async (id, doctorId) => {
  try {
    const patient = await db("patients").where({"id": id, doctor_id: doctorId}).first();
    return patient;
  } catch (err) {
    console.error("Error getting patient by ID from DB:", err);
    throw err;
  }
};  

export const updatePatientById = async (id, patientData, doctorId) => {
  try {
    const updatedPatient = await db("patients")
      .where({"id": id, doctor_id: doctorId})
      .update(patientData)
      .returning("*");

    return updatedPatient[0];
  } catch (err) {
    console.error("Error updating patient by ID in DB:", err);
    throw err;
  }
};

export const findExistingPatientWithId = async (id) => {
  try {
    const patient = await db("patients").where("id", id).first();
    return patient;
  } catch (err) {
    console.error("Error finding existing patient with ID in DB:", err);
    throw err;
  }
};

export const fetchPatients = async (options) => {
  try {
    let query = db("patients");

    if (options.conditions && Object.keys(options.conditions).length > 0) {
      query = query.where(options.conditions);
    }

    if (options.select && options.select.length > 0) {
      query = query.select(options.select);
    }

    if (options.orderBy) {
      query = query.orderBy(options.orderBy.column, options.orderBy.direction || 'asc'); // Default direction is 'asc'
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.offset(options.offset);
    }

    if (options.single) {
      const patient = await query.first();
      return patient;
    } else {
      const patients = await query;
      return patients;
    }

  } catch (err) {
    console.error("Error fetching patients from DB:", err);
    throw err;
  }
};