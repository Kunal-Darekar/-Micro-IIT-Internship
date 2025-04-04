const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
require('dotenv').config();

// Then check if the API key is loaded
console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('API KEY available:', process.env.OPENWEATHER_API_KEY ? 'Yes' : 'No');
console.log('API KEY length:', process.env.OPENWEATHER_API_KEY ? process.env.OPENWEATHER_API_KEY.length : 0);

// Import routes
const weatherRoutes = require('./routes/weather');

// Initialize Express app
const app = express();

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Apply rate limiting to API routes
app.use('/api', limiter);

// Routes
// Make sure you have this line
app.use('/api/weather', weatherRoutes);

// Add the following code to start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
});