const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ Import CORS
const connectDB = require('./config/db');
const hotelRoutes = require('./routes/hotelRoutes');
const errorHandler = require('./middleware/errorHandler');
const menuRoutes = require('./routes/menuRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

// ✅ Enable CORS (Allow frontend requests)
//app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({
  origin: 'https://qr-order-orcin.vercel.app', // <-- your deployed frontend
  credentials: true
}));


// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/hotels', hotelRoutes);
app.use('/api', menuRoutes);
app.use('/api', tableRoutes);
app.use('/api/orders', orderRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
