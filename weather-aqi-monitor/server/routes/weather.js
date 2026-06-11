const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

// ── GET /api/weather?lat=21.14&lon=79.08 ───────────────
// ── GET /api/weather?city=Nagpur ───────────────────────
router.get('/', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat && !lon && !city) {
      return res.status(400).json({ error: 'Provide lat & lon OR city name' });
    }

    const cacheKey = lat ? `weather_${lat}_${lon}` : `weather_${city}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    // Build query params
    const params = {
      appid: API_KEY,
      units: 'metric',
    };
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else {
      params.q = city;
    }

    const response = await axios.get(`${OWM_BASE}/weather`, { params });
    const d = response.data;

    const result = {
      city: d.name,
      country: d.sys.country,
      lat: d.coord.lat,
      lon: d.coord.lon,
      temp: Math.round(d.main.temp),
      feelsLike: Math.round(d.main.feels_like),
      tempMin: Math.round(d.main.temp_min),
      tempMax: Math.round(d.main.temp_max),
      humidity: d.main.humidity,
      pressure: d.main.pressure,
      visibility: d.visibility ? (d.visibility / 1000).toFixed(1) : 'N/A',
      windSpeed: d.wind.speed,
      windDeg: d.wind.deg,
      description: d.weather[0].description,
      icon: d.weather[0].icon,
      mainCondition: d.weather[0].main,
      cloudiness: d.clouds.all,
      sunrise: d.sys.sunrise,
      sunset: d.sys.sunset,
      timezone: d.timezone,
      dt: d.dt,
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    if (err.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    console.error('Weather API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
