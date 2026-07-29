const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLeadStatus,
  getLeadAnalytics,
} = require('../controllers/leadController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.post('/', requireAuth, createLead);
router.get('/', requireAuth, getLeads);
router.get('/analytics', requireAuth, requireRole('admin', 'agent'), getLeadAnalytics);
router.patch('/:id/status', requireAuth, updateLeadStatus);

module.exports = router;