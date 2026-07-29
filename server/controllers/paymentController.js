const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');

const initiatePayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'bookingId and a positive amount are required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.customerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Not authorized for this booking' });
    }

    // MOCKED: no real payment gateway integrated. Simulates instant success.
    const transaction = await Transaction.create({
      bookingId,
      userId: req.user.userId,
      amount,
      status: 'success',
      gatewayRef: `MOCK-${Date.now()}`,
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId })
      .populate('bookingId', 'scheduledAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { initiatePayment, getPaymentHistory };