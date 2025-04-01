import Joi from "joi";

export const patientSchema = Joi.object({
  full_name: Joi.string().max(100).required(),
  date_of_birth: Joi.date().iso().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().optional().allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  blood_group: Joi.string().max(5).optional().allow(null, ""),
  allergies: Joi.string().optional().allow(null, ""),
  chronic_conditions: Joi.string().optional().allow(null, ""),
  emergency_contact_name: Joi.string().max(100).optional().allow(null, ""),
  emergency_contact_phone: Joi.string().length(10).pattern(/^[0-9]+$/).optional().allow(null, ""),
  insurance_provider: Joi.string().max(100).optional().allow(null, ""),
  insurance_policy_number: Joi.string().max(50).optional().allow(null, "")
});

export const updatePatientSchema = Joi.object({
  full_name: Joi.string().max(100).optional().allow(null, ""),
  date_of_birth: Joi.date().iso().optional().allow(null, ""),
  gender: Joi.string().valid("Male", "Female", "Other").optional().allow(null, ""),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).optional().allow(null, ""),
  email: Joi.string().email().optional().allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  blood_group: Joi.string().max(5).optional().allow(null, ""),
  allergies: Joi.string().optional().allow(null, ""),
  chronic_conditions: Joi.string().optional().allow(null, ""),
  emergency_contact_name: Joi.string().max(100).optional().allow(null, ""),
  emergency_contact_phone: Joi.string().length(10).pattern(/^[0-9]+$/).optional().allow(null, ""),
  insurance_provider: Joi.string().max(100).optional().allow(null, ""),
  insurance_policy_number: Joi.string().max(50).optional().allow(null, "")
});


export const addVisitSchema = Joi.object({
  visit_date: Joi.date().iso().required(),
  weight: Joi.string().optional().allow(null, ''),
  blood_pressure: Joi.string().optional().allow(null, ''),
  heart_rate: Joi.string().optional().allow(null, ''),
  respiratory_rate: Joi.string().optional().allow(null, ''),
  temperature: Joi.string().optional().allow(null, ''),
  blood_sugar: Joi.string().optional().allow(null, ''),
  symptoms: Joi.string().optional().allow(null, ''),
  diagnosis: Joi.string().optional().allow(null, ''),
  medications_prescribed: Joi.string().optional().allow(null, ''),
  treatment_plan: Joi.string().optional().allow(null, ''),
  notes: Joi.string().optional().allow(null, ''),
}).or('notes', 'symptoms');

export const updateVisitSchema = Joi.object({
  visit_date: Joi.date().iso().required(),
  weight: Joi.string().optional().allow(null, ''),
  blood_pressure: Joi.string().optional().allow(null, ''),
  heart_rate: Joi.string().optional().allow(null, ''),
  respiratory_rate: Joi.string().optional().allow(null, ''),
  temperature: Joi.string().optional().allow(null, ''),
  blood_sugar: Joi.string().optional().allow(null, ''),
  symptoms: Joi.string().optional().allow(null, ''),
  diagnosis: Joi.string().optional().allow(null, ''),
  medications_prescribed: Joi.string().optional().allow(null, ''),
  treatment_plan: Joi.string().optional().allow(null, ''),
  notes: Joi.string().optional().allow(null, ''),
}).or('notes', 'symptoms');