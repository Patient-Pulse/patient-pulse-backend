import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../utils/respHandler.js";

import { doctorSchema } from '../validators/doctor.validator.js'

export const registerDoctor = async (req, res) => {
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

    const existingPatient = await findExistingPatient(value.phone, value.email);

    if (existingPatient) {
      return res.status(400).json({
        status: "error",
        message: "Patient with this phone or email already exists.",
      });
    }

    const patientId = await insertPatient(value);

    return res.status(201).json({
      status: "success",
      message: "Patient registered successfully",
      patient_id: patientId,
    });
  } catch (err) {
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};
