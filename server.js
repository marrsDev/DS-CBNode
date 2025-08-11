require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const cartSession = require('./middleware/cartSession');

const app = express();

// Initialize services
require('./services/PricingService').loadConfig();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cartSession); // Add cart session middleware

// Route imports
const previewRoutes = require('./routes/api/previewRoutes');
const cartRoutes = require('./routes/api/cartRoutes');
const configRoutes = require('./routes/api/configRoutes');
const calculationRoutes = require('./routes/api/calculationRoutes');

// API Routes
app.use('/api/window-preview', previewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/config', configRoutes);
app.use('/api/calculation', calculationRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/windowcart', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error',
      details: err.message 
    });
  }
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});