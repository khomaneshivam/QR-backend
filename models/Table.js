const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  tableNumber: { type: String, required: true, unique: true },
  qrCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Table', tableSchema);