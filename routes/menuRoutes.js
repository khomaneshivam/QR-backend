const express = require('express');
const {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItems,
  fetchMenuByHotel,
} = require('../controllers/menuController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Protected routes (require authentication)
router.post('/menu', authenticate, addMenuItem);
router.put('/menu/:id', authenticate, updateMenuItem);
router.delete('/menu/:id', authenticate, deleteMenuItem);
router.get('/menu', authenticate,getMenuItems);
router.get("/menu1", fetchMenuByHotel);

module.exports = router;