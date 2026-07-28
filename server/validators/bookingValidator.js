const Joi = require('joi');

const createBookingSchema = Joi.object({
  propertyId: Joi.string().required(),
  scheduledAt: Joi.date().greater('now').required().messages({
    'date.greater': 'Scheduled time must be in the future',
  }),
  notes: Joi.string().allow('').max(500),
});

const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').required(),
});

module.exports = { createBookingSchema, updateBookingStatusSchema };