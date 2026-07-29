const Joi = require('joi');

const createLeadSchema = Joi.object({
  propertyId: Joi.string().required(),
  source: Joi.string().default('contact-form'),
});

const updateLeadStatusSchema = Joi.object({
  status: Joi.string().valid('new', 'contacted', 'qualified', 'converted', 'lost').required(),
});

module.exports = { createLeadSchema, updateLeadStatusSchema };