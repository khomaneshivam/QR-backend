const Order = require("../models/Order");

// Place an Order (No Token Required)
exports.placeOrder = async (req, res) => {
  try {
    console.log("Incoming Order Data:", req.body); // Debugging log

    const { hotelId, tableNumber, items, totalAmount } = req.body;

    // Validate required fields
    if (!hotelId || !tableNumber || !items || items.length === 0 || totalAmount === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Ensure menuId is converted to ObjectId for MongoDB
    const formattedItems = items.map((item) => ({
      menuId: item.menuId, // Store menuId correctly
      name: item.name, // Store name for reference
      price: item.price,
      quantity: item.quantity,
    }));

    // Create and save the order
    const newOrder = new Order({
      hotelId,
      tableNumber,
      items: formattedItems, // Use formatted items
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again." });
  }
};
// Get all orders for a hotel (Token Required)
exports.getOrders = async (req, res) => {
  try {
    const hotelId = req.hotelId; // Extract from authentication middleware
    const { status } = req.query;

    const filter = { hotelId };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update Order Status (Token Required)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, hotelId: req.hotelId },
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
