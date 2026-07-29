const Joi = require('joi');

const createPropertySchema = Joi.object({
  title: Joi.string().min(5).max(120).required(),
  type: Joi.string().valid('apartment', 'villa', 'plot', 'commercial').required(),
  price: Joi.number().positive().required(),
  areaSqft: Joi.number().positive().required(),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string().uri()).min(1).max(20).required(),
});

const updatePropertySchema = Joi.object({
  title: Joi.string().min(5).max(120),
  type: Joi.string().valid('apartment', 'villa', 'plot', 'commercial'),
  price: Joi.number().positive(),
  areaSqft: Joi.number().positive(),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }),
  amenities: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string().uri()).min(1).max(20),
});

const searchPropertySchema = Joi.object({
  keyword: Joi.string().allow(''),
  type: Joi.string().valid('apartment', 'villa', 'plot', 'commercial'),
  minPrice: Joi.number().positive(),
  maxPrice: Joi.number().positive(),
  amenities: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

module.exports = { createPropertySchema, updatePropertySchema, searchPropertySchema };