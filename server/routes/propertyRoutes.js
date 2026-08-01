const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  searchProperties,
  getAllPropertiesAdmin,
} = require('../controllers/propertyController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/search', searchProperties);
router.get('/admin/all', requireAuth, requireRole('admin'), getAllPropertiesAdmin);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', requireAuth, requireRole('owner', 'agent'), createProperty);
router.put('/:id', requireAuth, updateProperty);
router.delete('/:id', requireAuth, deleteProperty);
router.patch('/:id/status', requireAuth, requireRole('admin'), updatePropertyStatus);

module.exports = router;