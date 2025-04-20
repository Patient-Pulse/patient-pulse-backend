import Joi from "joi";

export const patientSchema = Joi.object({
  full_name: Joi.string().required().max(100),
  date_of_birth: Joi.date().required().max('now'),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  phone: Joi.string().allow('').max(15).pattern(/^[0-9]+$/),
  email: Joi.string().allow('').email().max(100),
  address: Joi.string().allow('').max(500),
  blood_group: Joi.string().allow('').max(5),
  allergies: Joi.string().allow('').max(1000),
  chronic_conditions: Joi.string().allow('').max(1000),
  emergency_contact_name: Joi.string().allow('').max(100),
  emergency_contact_phone: Joi.string().allow('').max(15),
  insurance_provider: Joi.string().allow('').max(100),
  insurance_policy_number: Joi.string().allow('').max(50),
  doctor_id: Joi.string().when('$userRole', {
    is: 'staff',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  })
}).or('phone', 'email');

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
  insurance_policy_number: Joi.string().max(50).optional().allow(null, ""),
  doctor_id: Joi.string().max(50).optional().allow(null, "")
});


export const addVisitSchema = Joi.object({
  weight: Joi.string().optional().allow(null, ''),
  blood_pressure: Joi.string().optional().allow(null, ''),
  heart_rate: Joi.string().optional().allow(null, ''),
  respiratory_rate: Joi.string().optional().allow(null, ''),
  temperature: Joi.string().optional().allow(null, ''),
  blood_sugar: Joi.string().optional().allow(null, ''),
  symptoms: Joi.string().optional().allow(null, ''),
  diagnosis: Joi.string().optional().allow(null, ''),
  treatment_plan: Joi.string().optional().allow(null, ''),
  notes: Joi.string().optional().allow(null, ''),
  doctor_id: Joi.string().optional().allow(null, ''),
  amount: Joi.number().positive().required(),
  medications: Joi.array().items(
    Joi.object({
      clinic_medicine_id: Joi.string().allow(null),
      global_medicine_id: Joi.string().allow(null),
      medicine_name: Joi.string().required(),
      dosage: Joi.string().required(),
      formulation: Joi.string().required(),
      quantity: Joi.number().required(),
      frequency: Joi.string().required(),
      after_meal: Joi.boolean().allow(null),
      instructions: Joi.string().allow(null, ''),
      is_custom: Joi.boolean().default(false)
    })
  ).optional().default([]),
}).or('notes', 'symptoms');

export const updateVisitSchema = Joi.object({
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
  doctor_id: Joi.string().optional().allow(null, ''),
  amount: Joi.number().positive().optional(),
  medications: Joi.array().items(
    Joi.object({
      clinic_medicine_id: Joi.string().allow(null),
      global_medicine_id: Joi.string().allow(null),
      medicine_name: Joi.string().required(),
      dosage: Joi.string().required(),
      formulation: Joi.string().valid(
        'Tablet', 'Capsule', 'Syrup', 'Injection', 
        'Cream', 'Ointment', 'Drops', 'Suspension', 'Other'
      ).required(),
      quantity: Joi.number().integer().positive().required(),
      frequency: Joi.string().required(),
      after_meal: Joi.boolean().allow(null),
      instructions: Joi.string().allow(null, '')
      // is_custom: Joi.boolean().default(false)
    })
  ).optional()
}).or('notes', 'symptoms');