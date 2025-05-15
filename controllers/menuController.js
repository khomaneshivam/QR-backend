const Menu = require('../models/Menu');

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const hotelId = req.hotelId; // From authentication middleware

    const menuItem = new Menu({ hotelId, name, description, price, category });
    await menuItem.save();

    res.status(201).json({ message: 'Menu item added successfully!', menuItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const menuItem = await Menu.findByIdAndUpdate(
      id,
      { name, description, price, category },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found!' });
    }

    res.json({ message: 'Menu item updated successfully!', menuItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await Menu.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found!' });
    }

    res.json({ message: 'Menu item deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all menu items for a hotel
exports.getMenuItems = async (req, res) => {
  try {
    const hotelId = req.hotelId; // From authentication middleware
    const menuItems = await Menu.find({ hotelId });

    res.json({ menuItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Function to fetch menu items without authentication
exports.fetchMenuByHotel = async (req, res) => {
  try {
    const { hotelId } = req.query; // Get hotelId from query parameters

    if (!hotelId) {
      return res.status(400).json({ error: "Hotel ID is required" });
    }

    const menuItems = await Menu.find({ hotelId });

    res.json({ menuItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
