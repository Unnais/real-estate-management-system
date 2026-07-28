const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: ['apartment', 'villa', 'plot', 'commercial'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    areaSqft: {
      type: Number,
      required: true,
      min: 0.01,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 20,
        message: 'A property must have between 1 and 20 images',
      },
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'inactive'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

propertySchema.index({ location: '2dsphere' });
propertySchema.index({ ownerId: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ price: 1 });

module.exports = mongoose.model('Property', propertySchema);