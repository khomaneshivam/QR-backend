const express = require('express');
const {
  registerHotel,
  loginHotel,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/hotelController');
const router = express.Router();

// Public routes
router.post('/register', registerHotel);
router.post('/login', loginHotel);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;