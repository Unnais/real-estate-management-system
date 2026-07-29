const express = require('express');
const router = express.Router();
const { initiatePayment, getPaymentHistory } = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/initiate', requireAuth, initiatePayment);
router.get('/history', requireAuth, getPaymentHistory);

module.exports = router;