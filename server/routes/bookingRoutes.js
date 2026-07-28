const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/', requireAuth, createBooking);
router.get('/user/me', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);
router.patch('/:id/status', requireAuth, updateBookingStatus);

module.exports = router;