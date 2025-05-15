const { verifyToken } = require('../utils/jwt');

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied! No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    console.log('Decoded Token:', decoded);

    if (!decoded.hotelId) {
      return res.status(400).json({ message: 'Invalid token! Missing hotelId.' });
    }

    req.hotelId = decoded.hotelId;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token!' });
  }
};
