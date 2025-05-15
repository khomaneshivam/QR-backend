const express = require('express');
const { generateTableQR, getTables } = require('../controllers/tableController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate QR Code for a table (POST request)
router.post('/tables/generateQR', authenticate, generateTableQR);

// Get all tables for a hotel (GET request)
router.get('/tables', authenticate, getTables);

module.exports = router;
