import Joi from "joi";

export const doctorSchema = Joi.object({
    full_name: Joi.string().max(100).required(),
    email: Joi.string().email().optional().allow(null, ""),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().max(100).required(),
    clinic_name: Joi.string().max(100).optional().allow(null, "")
})