const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  tableNumber: { type: Number, required: true },
  items: [
    {
      menuId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true }, // Changed from itemId to menuId
      name: { type: String, required: true }, // ✅ Include name field
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
