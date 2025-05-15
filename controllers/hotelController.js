const Hotel = require('../models/Hotel');
const { generateToken } = require('../utils/jwt');
const nodemailer = require('nodemailer');

// Register a new hotel
exports.registerHotel = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    // Check if hotel already exists
    const existingHotel = await Hotel.findOne({ email });
    if (existingHotel) {
      return res.status(400).json({ message: 'Hotel already exists!' });
    }

    // Create new hotel
    const hotel = new Hotel({ name, email, password, address, phone });
    await hotel.save();

    // Generate JWT token
    const token = generateToken(hotel._id);

    res.status(201).json({ message: 'Hotel registered successfully!', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a hotel
exports.loginHotel = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find hotel by email
    const hotel = await Hotel.findOne({ email });
    if (!hotel) {
      return res.status(400).json({ message: 'Hotel not found!' });
    }

    // Compare passwords
    const isMatch = await hotel.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Generate JWT token
    const token = generateToken(hotel._id);

    res.json({ message: 'Login successful!', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const hotel = await Hotel.findOne({ email });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found!' });
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(20).toString('hex');
    hotel.resetPasswordToken = resetToken;
    hotel.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await hotel.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetUrl = `http://your-frontend-url.com/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      to: hotel.email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetUrl}`,
    });

    res.json({ message: 'Password reset email sent!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hotel = await Hotel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!hotel) {
      return res.status(400).json({ message: 'Invalid or expired token!' });
    }

    // Update password and clear reset token
    hotel.password = newPassword;
    hotel.resetPasswordToken = undefined;
    hotel.resetPasswordExpires = undefined;
    await hotel.save();

    res.json({ message: 'Password reset successful!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};