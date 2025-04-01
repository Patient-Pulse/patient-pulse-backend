import {
  patientSchema,
  updatePatientSchema,
} from "../validator/patient.validator.js";

import {
  findExistingPatient,
  insertPatient,
  fetchPatientsWithPagination,
  getTotalPatientCount,
  fetchPatientById,
  updatePatientById,
  findExistingPatientWithId
} from "../dbo/patients.dbo.js";

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../utils/respHandler.js";

export const registerPatient = async (req, res) => {
  const { userId } = req;

  try {
    const { error, value } = patientSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const existingPatient = await findExistingPatient(value.phone, value.email, userId);

    if (existingPatient) {
      return res.status(400).json({
        status: "error",
        message: "Patient with this phone or email already exists.",
      });
    }

    const patientId = await insertPatient(value, userId);

    return res.status(201).json({
      status: "success",
      message: "Patient registered successfully",
      patient_id: patientId,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getPatients = async (req, res) => {
  const { userId } = req;

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
      userId
    );
    const totalCount = await getTotalPatientCount(search, gender, userId);
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
    const { id } = req.params;
    const { userId } = req;

    const patient = await fetchPatientById(id, userId);

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
    const { id } = req.params;
    const { body, userId } = req;

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

    const existingPatient = await findExistingPatientWithId(id);

    if (!existingPatient) {
      return res.status(400).json({
        status: "error",
        message: "Patient with this id not found.",
      });
    }

    const updatedPatient = await updatePatientById(id, value, userId);

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

