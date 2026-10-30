const express = require('express');
const router = express.Router();
const {
  listCrops, getCrop, createCrop, myCrops, updateCrop, deleteCrop,
} = require('../controllers/cropController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/', listCrops);
router.get('/mine', protect, requireRole('farmer'), myCrops);
router.get('/:id', getCrop);
router.post('/', protect, requireRole('farmer'), createCrop);
router.put('/:id', protect, requireRole('farmer'), updateCrop);
router.delete('/:id', protect, requireRole('farmer'), deleteCrop);

module.exports = router;
