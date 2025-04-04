// DOM elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const celsiusBtn = document.getElementById('celsius');
const fahrenheitBtn = document.getElementById('fahrenheit');
const cityNameEl = document.getElementById('city-name');
const localTimeEl = document.getElementById('local-time');
const localDateEl = document.getElementById('local-date');
const weatherIconEl = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const weatherConditionEl = document.getElementById('weather-condition');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');
const pressureEl = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecast-container');
const historyContainer = document.getElementById('history-container');
const clearHistoryBtn = document.getElementById('clear-history');
const themeToggle = document.querySelector('.theme-toggle');
const loader = document.querySelector('.loader');
const errorContainer = document.querySelector('.error-container');
const errorMessage = document.getElementById('error-message');

// State variables
let currentUnit = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// API endpoints
const API_BASE_URL = '/api/weather';

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Display search history
    displaySearchHistory();
    
    // If there's a last searched city, show its weather
    const lastCity = searchHistory[0];
    if (lastCity) {
        getWeatherData(lastCity);
    }
});

searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                hideLoader();
                showError('Unable to retrieve your location. Please allow location access or search manually.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
});

celsiusBtn.addEventListener('click', () => {
    if (currentUnit !== 'metric') {
        currentUnit = 'metric';
        updateUnitButtons();
        // Refresh weather data with new unit
        const cityName = cityNameEl.textContent;
        if (cityName !== '--') {
            getWeatherData(cityName);
        }
    }
});

fahrenheitBtn.addEventListener('click', () => {
    if (currentUnit !== 'imperial') {
        currentUnit = 'imperial';
        updateUnitButtons();
        // Refresh weather data with new unit
        const cityName = cityNameEl.textContent;
        if (cityName !== '--') {
            getWeatherData(cityName);
        }
    }
});

clearHistoryBtn.addEventListener('click', () => {
    searchHistory = [];
    localStorage.removeItem('weatherSearchHistory');
    displaySearchHistory();
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Functions
async function getWeatherData(city) {
    showLoader();
    hideError();
    
    try {
        // Get current weather
        const currentWeatherResponse = await fetch(`${API_BASE_URL}/current?city=${encodeURIComponent(city)}&units=${currentUnit}`);
        const currentWeatherData = await currentWeatherResponse.json();
        
        if (!currentWeatherResponse.ok) {
            throw new Error(currentWeatherData.message || 'Error fetching weather data');
        }
        
        // Get 5-day forecast
        const forecastResponse = await fetch(`${API_BASE_URL}/forecast?city=${encodeURIComponent(city)}&units=${currentUnit}`);
        const forecastData = await forecastResponse.json();
        
        if (!forecastResponse.ok) {
            throw new Error(forecastData.message || 'Error fetching forecast data');
        }
        
        // Update UI with weather data
        updateWeatherUI(currentWeatherData.data, forecastData.data);
        
        // Add to search history if not already present
        addToSearchHistory(city);
        
        // Clear search input
        searchInput.value = '';
        
    } catch (error) {
        showError(error.message);
        console.error('Error fetching weather data:', error);
    } finally {
        hideLoader();
    }
}

async function getWeatherByCoordinates(lat, lon) {
    try {
        // Get current weather
        const currentWeatherResponse = await fetch(`${API_BASE_URL}/current/coordinates?lat=${lat}&lon=${lon}&units=${currentUnit}`);
        const currentWeatherData = await currentWeatherResponse.json();
        
        if (!currentWeatherResponse.ok) {
            throw new Error(currentWeatherData.message || 'Error fetching weather data');
        }
        
        // Get 5-day forecast
        const forecastResponse = await fetch(`${API_BASE_URL}/forecast/coordinates?lat=${lat}&lon=${lon}&units=${currentUnit}`);
        const forecastData = await forecastResponse.json();
        
        if (!forecastResponse.ok) {
            throw new Error(forecastData.message || 'Error fetching forecast data');
        }
        
        // Update UI with weather data
        updateWeatherUI(currentWeatherData.data, forecastData.data);
        
        // Add to search history
        addToSearchHistory(currentWeatherData.data.name);
        
    } catch (error) {
        showError(error.message);
        console.error('Error fetching weather data by coordinates:', error);
    } finally {
        hideLoader();
    }
}

function updateWeatherUI(currentData, forecastData) {
    // Update current weather
    cityNameEl.textContent = `${currentData.name}, ${currentData.sys.country}`;
    
    // Set local time and date
    const timezone = currentData.timezone;
    const localTime = new Date(Date.now() + timezone * 1000 + new Date().getTimezoneOffset() * 60 * 1000);
    
    localTimeEl.textContent = localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    localDateEl.textContent = localTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Weather icon
    const iconCode = currentData.weather[0].icon;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconEl.alt = currentData.weather[0].description;
    
    // Temperature and condition
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    temperatureEl.textContent = `${Math.round(currentData.main.temp)}${tempUnit}`;
    weatherConditionEl.textContent = currentData.weather[0].description;
    
    // Additional info
    humidityEl.textContent = `${currentData.main.humidity}%`;
    
    const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';
    windSpeedEl.textContent = `${currentData.wind.speed} ${windUnit}`;
    
    feelsLikeEl.textContent = `${Math.round(currentData.main.feels_like)}${tempUnit}`;
    pressureEl.textContent = `${currentData.main.pressure} hPa`;
    
    // Update background based on weather condition
    updateBackgroundByWeather(currentData.weather[0].main);
    
    // Update forecast
    updateForecastUI(forecastData);
}

function updateForecastUI(forecastData) {
    forecastContainer.innerHTML = '';
    
    // Group forecast data by day (excluding current day)
    const dailyForecasts = {};
    const currentDate = new Date().setHours(0, 0, 0, 0);
    
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).setHours(0, 0, 0, 0);
        
        // Skip current day
        if (date === currentDate) return;
        
        if (!dailyForecasts[date] || new Date(item.dt * 1000).getHours() === 12) {
            dailyForecasts[date] = item;
        }
    });
    
    // Get only 5 days
    const fiveDayForecast = Object.values(dailyForecasts).slice(0, 5);
    
    // Create forecast cards
    fiveDayForecast.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const iconCode = forecast.weather[0].icon;
        const description = forecast.weather[0].description;
        const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <h4>${dayName}</h4>
            <p>${monthDay}</p>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">
            <p>${description}</p>
            <div class="temp-range">
                <span>${Math.round(forecast.main.temp_min)}${tempUnit}</span>
                <span>${Math.round(forecast.main.temp_max)}${tempUnit}</span>
            </div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

function updateBackgroundByWeather(weatherMain) {
    // Remove all weather-related classes
    document.body.classList.remove(
        'clear-sky',
        'clouds',
        'rain',
        'snow',
        'thunderstorm',
        'mist'
    );
    
    // Add appropriate class based on weather
    switch (weatherMain.toLowerCase()) {
        case 'clear':
            document.body.classList.add('clear-sky');
            break;
        case 'clouds':
            document.body.classList.add('clouds');
            break;
        case 'rain':
        case 'drizzle':
            document.body.classList.add('rain');
            break;
        case 'snow':
            document.body.classList.add('snow');
            break;
        case 'thunderstorm':
            document.body.classList.add('thunderstorm');
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            document.body.classList.add('mist');
            break;
        default:
            // Default background is handled by CSS
            break;
    }
}

function addToSearchHistory(city) {
    // Remove city if it already exists in history
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add city to the beginning of the array
    searchHistory.unshift(city);
    
    // Keep only the last 8 searches
    if (searchHistory.length > 8) {
        searchHistory = searchHistory.slice(0, 8);
    }
    
    // Save to localStorage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    
    // Update UI
    displaySearchHistory();
}

function displaySearchHistory() {
    historyContainer.innerHTML = '';
    
    searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = city;
        historyItem.addEventListener('click', () => {
            getWeatherData(city);
        });
        
        historyContainer.appendChild(historyItem);
    });
    
    // Show/hide clear button based on history
    clearHistoryBtn.style.display = searchHistory.length > 0 ? 'block' : 'none';
}

function updateUnitButtons() {
    if (currentUnit === 'metric') {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
    } else {
        celsiusBtn.classList.remove('active');
        fahrenheitBtn.classList.add('active');
    }
}

function showLoader() {
    loader.style.display = 'flex';
}

function hideLoader() {
    loader.style.display = 'none';
}

function showError(message) {
    errorContainer.style.display = 'block';
    errorMessage.textContent = message;
}

function hideError() {
    errorContainer.style.display = 'none';
}