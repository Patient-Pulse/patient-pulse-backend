import db from "../../../config/knex.js";
import { nanoid } from "nanoid";

export const insertPatient = async (patientData) => {
  try {
    const [patientId] = await db("patients").insert({
      id: nanoid(),
      ...patientData,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    });

    return patientId;
  } catch (err) {
    console.error("Error inserting patient:", err);
    throw err;
  }
};

export const findPatientsByContact = async (clinic_id, phone, email, doctor_id = null) => {
  const query = db("patients").where("clinic_id", clinic_id);

  if (doctor_id) {
    query.where("doctor_id", doctor_id);
  }

  if (phone || email) {
    query.andWhere(function() {
      if (phone) this.where("phone", phone);
      if (email) this.where("email", email);
    });
  }

  return query
    .orderBy("created_at", "desc")
    .limit(8);
}

export const findExistingPatient = async (phone, email, clinicId) => {
  try {
    let query = db("patients")
      .where({
        clinic_id: clinicId
      })
      .where(function() {
        this.where('phone', phone);
        
        if (email) {
          this.orWhere('email', email);
        }
      });

    return await query.first();
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
  clinicId,
  doctorId
) => {
  try {
    const offset = (page - 1) * limit;

    let query = db("patients")
      .where("clinic_id", clinicId)
      .orderBy(sortBy, sortOrder)
      .offset(offset)
      .limit(limit);

    if (doctorId) {
      query = query.where("doctor_id", doctorId);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(function () {
        this.where("full_name", "like", searchTerm)
          .orWhere("phone", "like", searchTerm)
          .orWhere("email", "like", searchTerm);
      });
    }

    if (gender && ["Male", "Female", "Other"].includes(gender)) {
      query = query.where("gender", gender);
    }

    return await query;
  } catch (err) {
    console.error("Error fetching patients from DB:", err);
    throw err;
  }
};

export const getTotalPatientCount = async (search, gender, clinicId, doctorId) => {
  try {
    let query = db("patients").where("clinic_id", clinicId).count("* as total");

    if (doctorId) {
      query = query.where("doctor_id", doctorId);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(function () {
        this.where("full_name", "like", searchTerm)
          .orWhere("phone", "like", searchTerm)
          .orWhere("email", "like", searchTerm);
      });
    }

    if (gender && ["Male", "Female", "Other"].includes(gender)) {
      query = query.where("gender", gender);
    }

    const total = await query.first();
    return total.total;
  } catch (err) {
    console.error("Error getting patient count from DB:", err);
    throw err;
  }
};

export const fetchPatientById = async (id, doctorId, userRole) => {
    try {
        let query = db("patients").where({ id: id });

        if (userRole === "doctor") {
            query = query.where({ doctor_id: doctorId });
        }

        const patient = await query.first();
        return patient;
    } catch (err) {
        console.error("Error getting patient by ID from DB:", err);
        throw err;
    }
};

export const updatePatientById = async (id, patientData, doctorId, userRole) => {
  try {
    let query = db("patients").where("id", id);

    if(userRole === 'doctor') {
      query = query.where({ doctor_id: doctorId });
    }

    const patient = await query.update(patientData);
    return patient[0];
  } catch (err) {
    console.error("Error updating patient by ID in DB:", err);
    throw err;
  }
};

export const findExistingPatientWithId = async (id, doctorId, userRole) => {
  try {
    let query = db("patients").where("id", id);

    if(userRole === 'doctor') {
      query = query.where({ doctor_id: doctorId });
    }
    
    const patient = await query.first();
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