import {
  patientSchema,
  updatePatientSchema,
} from "../validator/patient.validator.js";

import {
  findPatientsByContact,
  insertPatient,
  fetchPatientsWithPagination,
  getTotalPatientCount,
  fetchPatientById,
  updatePatientById,
  findExistingPatientWithId
} from "../dbo/patients.dbo.js";


export const registerPatient = async (req, res) => { 
  const { clinic_id, user_id, user_role } = req;

  try {
    const { error, value } = patientSchema.validate(req.body, {
      abortEarly: false,
      context: { userRole: user_role }
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
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

    const matches = await findPatientsByContact(
      clinic_id, 
      value.phone, 
      value.email,
      value.full_name,
      doctor_id
    );

    if (matches.length > 0) {
      return res.status(400).json({
        code: "POTENTIAL_DUPLICATE",
        message: "A patient with this name and contact information may already exist",
        matches
      });
    }

    const patientId = await insertPatient({ 
      ...value,
      clinic_id,
      doctor_id
    });

    return res.status(201).json({
      status: "success",
      message: "Patient registered successfully",
      data: {
        patient_id: patientId,
        clinic_id,
        doctor_id
      }
    });
  } catch (err) {
    console.error("Error in registerPatient:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getPatients = async (req, res) => { 
  const { clinic_id, user_id, user_role } = req;

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
    const search = req.query.search;
    const gender = req.query.gender;

    const patients = await fetchPatientsWithPagination(
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      gender,
      clinic_id,
      user_role === "doctor" ? user_id : null
    );
    
    const totalCount = await getTotalPatientCount(
      search,
      gender,
      clinic_id,
      user_role === "doctor" ? user_id : null
    );
    
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: "success",
      data: patients,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error in getPatients controller:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id: patient_id } = req.params;
    const { user_id, user_role, clinic_id} = req;

    const patient = await fetchPatientById(patient_id, user_id, user_role);

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: patient,
    });
  } catch (err) {
    console.error("Error in getPatientById controller:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { body, user_id, user_role} = req;

    const { error, value } = updatePatientSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const existingPatient = await findExistingPatientWithId(patient_id, user_id, user_role);

    if (!existingPatient) {
      return res.status(400).json({
        status: "error",
        message: "Patient with this patient_id not found.",
      });
    }

    const updatedPatient = await updatePatientById(patient_id, value, user_id, user_role);

    return res.status(200).json({
      status: "success",
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

