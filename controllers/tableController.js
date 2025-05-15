const Table = require("../models/Table");
const QRCode = require("qrcode");

// Generate QR code for a table
exports.generateTableQR = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    const hotelId = req.hotelId; // Extracted from authentication middleware

    // Validate input
    if (!tableNumber) {
      return res.status(400).json({ error: "Table number is required." });
    }

    if (!hotelId) {
      return res.status(401).json({ error: "Unauthorized request. Missing hotel ID." });
    }

    // Check if table already exists
    const existingTable = await Table.findOne({ hotelId, tableNumber });
    if (existingTable) {
      return res.status(409).json({ error: "Table number already exists for this hotel." });
    }

    // Generate a QR code with the table-specific URL
    const qrData = `${process.env.FRONTEND_URL}/place-order?hotelId=${hotelId}&table=${tableNumber}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Save table with QR code
    const newTable = new Table({ hotelId, tableNumber, qrCode });
    await newTable.save();

    res.status(201).json({
      message: "QR code generated successfully!",
      table: newTable,
    });
  } catch (error) {
    console.error("QR Code Generation Error:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again." });
  }
};

// Get all tables for a hotel
exports.getTables = async (req, res) => {
  try {
    const hotelId = req.hotelId; // Extracted from authentication middleware
    if (!hotelId) {
      return res.status(401).json({ error: "Unauthorized request. Missing hotel ID." });
    }

    const tables = await Table.find({ hotelId }).sort({ tableNumber: 1 });

    res.status(200).json({
      message: "Tables fetched successfully.",
      tables,
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again." });
  }
};
