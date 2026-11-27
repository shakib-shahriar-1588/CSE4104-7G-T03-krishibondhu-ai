const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');

// Route: /api/weather?city=Dhaka
router.get('/', getWeather);

module.exports = router;