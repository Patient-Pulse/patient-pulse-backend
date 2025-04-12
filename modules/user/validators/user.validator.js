import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  status: Joi.string().valid("approved", "pending", "rejected").required(),
  phone_number: Joi.string().pattern(/^[0-9]+$/).min(7).max(15).required(),
  role: Joi.string().valid("admin", "staff", "doctor").required(),
});