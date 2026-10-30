const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');

// Public endpoint - no auth required, e.g. GET /api/weather?location=Ranipet
router.get('/', getWeather);

module.exports = router;
