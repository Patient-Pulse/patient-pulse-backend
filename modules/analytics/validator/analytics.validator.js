import Joi from 'joi';

export const visitAnalyticsSchema = Joi.object({
  range: Joi.string().valid('7d', '30d', '90d', '180d').default('7d'),
  doctor_id: Joi.string().trim().optional()
});