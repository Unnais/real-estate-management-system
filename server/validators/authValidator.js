const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one number and one symbol',
    }),
  role: Joi.string().valid('owner', 'agent', 'customer').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };