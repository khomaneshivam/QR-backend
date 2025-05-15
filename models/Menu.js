const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'drinks'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Menu', menuSchema);