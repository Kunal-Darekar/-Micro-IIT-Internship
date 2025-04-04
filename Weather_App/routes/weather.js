const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for OpenWeatherMap API
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Get current weather by city name
router.get('/current', async (req, res) => {
    try {
        const { city, units = 'metric' } = req.query;
        
        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'City parameter is required'
            });
        }
        
        console.log(`Fetching weather for city: ${city}, units: ${units}`);
        console.log(`API key length: ${API_KEY ? API_KEY.length : 'Not available'}`);
        console.log(`API key first 5 chars: ${API_KEY ? API_KEY.substring(0, 5) : 'N/A'}`);
        
        // Check if API_KEY is defined
        if (!API_KEY) {
            console.error('API_KEY is undefined or empty');
            return res.status(500).json({
                success: false,
                message: 'API key configuration error'
            });
        }
        
        const url = `${OPENWEATHER_BASE_URL}/weather`;
        console.log(`Making request to: ${url} with params: q=${city}, units=${units}`);
        
        const response = await axios.get(url, {
            params: {
                q: city,
                units,
                appid: API_KEY
            }
        });
        
        console.log('OpenWeatherMap API response received successfully');
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Error in /current route:', error.message);
        
        if (error.response) {
            console.error('OpenWeatherMap API response status:', error.response.status);
            console.error('OpenWeatherMap API response data:', JSON.stringify(error.response.data));
        } else if (error.request) {
            console.error('No response received from OpenWeatherMap API');
        } else {
            console.error('Error setting up request:', error.message);
        }
        
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error fetching weather data',
            error: error.message
        });
    }
});

// Get current weather by coordinates
router.get('/current/coordinates', async (req, res) => {
    try {
        const { lat, lon, units = 'metric' } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude parameters are required'
            });
        }
        
        const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
            params: {
                lat,
                lon,
                units,
                appid: API_KEY
            }
        });
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching weather data',
            error: error.message
        });
    }
});

// Get 5-day forecast by city name
router.get('/forecast', async (req, res) => {
    try {
        const { city, units = 'metric' } = req.query;
        
        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'City parameter is required'
            });
        }
        
        const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
            params: {
                q: city,
                units,
                appid: API_KEY
            }
        });
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error fetching forecast data',
            error: error.message
        });
    }
});

// Get 5-day forecast by coordinates
router.get('/forecast/coordinates', async (req, res) => {
    try {
        const { lat, lon, units = 'metric' } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude parameters are required'
            });
        }
        
        const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
            params: {
                lat,
                lon,
                units,
                appid: API_KEY
            }
        });
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching forecast data',
            error: error.message
        });
    }
});

module.exports = router;