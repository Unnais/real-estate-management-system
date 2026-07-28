const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { createBookingSchema, updateBookingStatusSchema } = require('../validators/bookingValidator');

const createBooking = async (req, res) => {
  try {
    const { error, value } = createBookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const property = await Property.findById(value.propertyId);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const conflict = await Booking.findOne({
      propertyId: value.propertyId,
      scheduledAt: value.scheduledAt,
      status: 'confirmed',
    });
    if (conflict) {
      return res.status(409).json({ success: false, error: 'This time slot is already booked' });
    }

    const booking = await Booking.create({
      propertyId: value.propertyId,
      customerId: req.user.userId,
      scheduledAt: value.scheduledAt,
      notes: value.notes || '',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.userId })
      .populate('propertyId', 'title price')
      .sort({ scheduledAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyId', 'title ownerId agentId');
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const isCustomer = booking.customerId.toString() === req.user.userId;
    const isOwner = booking.propertyId.ownerId?.toString() === req.user.userId;
    const isAgent = booking.propertyId.agentId?.toString() === req.user.userId;
    if (!isCustomer && !isOwner && !isAgent && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to view this booking' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { error, value } = updateBookingStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const booking = await Booking.findById(req.params.id).populate('propertyId', 'ownerId agentId');
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const isOwner = booking.propertyId.ownerId?.toString() === req.user.userId;
    const isAgent = booking.propertyId.agentId?.toString() === req.user.userId;
    if (!isOwner && !isAgent && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this booking' });
    }

    if (value.status === 'confirmed') {
      const conflict = await Booking.findOne({
        propertyId: booking.propertyId._id,
        scheduledAt: booking.scheduledAt,
        status: 'confirmed',
        _id: { $ne: booking._id },
      });
      if (conflict) {
        return res.status(409).json({ success: false, error: 'This time slot is already confirmed for another booking' });
      }
    }

    booking.status = value.status;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, updateBookingStatus };