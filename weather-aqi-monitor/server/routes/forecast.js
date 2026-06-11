const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 1800 }); // Cache for 30 minutes

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

// ── GET /api/forecast?lat=21.14&lon=79.08 ─────────────
// ── GET /api/forecast?city=Nagpur ─────────────────────
router.get('/', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat && !lon && !city) {
      return res.status(400).json({ error: 'Provide lat & lon OR city name' });
    }

    const cacheKey = lat ? `forecast_${lat}_${lon}` : `forecast_${city}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    const params = { appid: API_KEY, units: 'metric', cnt: 40 };
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else {
      params.q = city;
    }

    const response = await axios.get(`${OWM_BASE}/forecast`, { params });
    const list = response.data.list;

    // Group by day and pick the midday reading
    const grouped = {};
    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      const hour = date.getHours();

      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push({ ...item, hour });
    });

    const days = Object.entries(grouped).slice(0, 5).map(([date, items]) => {
      // Prefer the 12:00-15:00 reading, otherwise take first
      const midday = items.find(i => i.hour >= 12 && i.hour <= 15) || items[0];
      const temps = items.map(i => i.main.temp);

      return {
        date,
        dayLabel: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
        temp: Math.round(midday.main.temp),
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        humidity: midday.main.humidity,
        description: midday.weather[0].description,
        icon: midday.weather[0].icon,
        mainCondition: midday.weather[0].main,
        windSpeed: midday.wind.speed,
        pop: Math.round((midday.pop || 0) * 100), // Precipitation probability %
      };
    });

    // 24-hour temperature data for chart (today's hourly)
    const todayKey = Object.keys(grouped)[0];
    const hourly = (grouped[todayKey] || []).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      temp: Math.round(item.main.temp),
      humidity: item.main.humidity,
    }));

    const result = { days, hourly };
    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('Forecast API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

module.exports = router;
