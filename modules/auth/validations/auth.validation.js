import Joi from 'joi';

export const registerClinicSchema = Joi.object({
  clinic_name: Joi.string().min(3).max(100).required(),
  clinic_email: Joi.string().email().required(),
  clinic_phone: Joi.string().pattern(/^[0-9]+$/).min(7).max(15).required(),
  clinic_address: Joi.string().min(5).max(255).required(),
  admin_name: Joi.string().min(3).max(100).required(),
  admin_email: Joi.string().email().required(),
  admin_password: Joi.string().min(6).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]+$/).min(7).max(15).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  clinic_id: Joi.string().optional()
});