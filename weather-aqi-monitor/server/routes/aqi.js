const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const WAQI_BASE = 'https://api.waqi.info';
const TOKEN = process.env.WAQI_API_TOKEN;

// AQI level helper
function getAQILevel(aqi) {
  if (aqi <= 50)  return { level: 'Good',                color: '#00E400', alert: false };
  if (aqi <= 100) return { level: 'Moderate',            color: '#FFFF00', alert: false };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#FF7E00', alert: true };
  if (aqi <= 200) return { level: 'Unhealthy',           color: '#FF0000', alert: true };
  if (aqi <= 300) return { level: 'Very Unhealthy',      color: '#99004C', alert: true };
  return          { level: 'Hazardous',                  color: '#7E0023', alert: true };
}

// ── GET /api/aqi?lat=21.14&lon=79.08 ──────────────────
// ── GET /api/aqi?city=Nagpur ───────────────────────────
router.get('/', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat && !lon && !city) {
      return res.status(400).json({ error: 'Provide lat & lon OR city name' });
    }

    const cacheKey = lat ? `aqi_${lat}_${lon}` : `aqi_${city}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    let url;
    if (lat && lon) {
      url = `${WAQI_BASE}/feed/geo:${lat};${lon}/?token=${TOKEN}`;
    } else {
      url = `${WAQI_BASE}/feed/${encodeURIComponent(city)}/?token=${TOKEN}`;
    }

    const response = await axios.get(url);
    const d = response.data;

    if (d.status !== 'ok') {
      return res.status(404).json({ error: 'AQI data not found for this location' });
    }

    const data = d.data;
    const aqi = data.aqi;
    const aqiInfo = getAQILevel(aqi);

    // Extract individual pollutants safely
    const iaqi = data.iaqi || {};
    const pollutants = {
      pm25: iaqi.pm25?.v ?? null,
      pm10: iaqi.pm10?.v ?? null,
      no2:  iaqi.no2?.v  ?? null,
      o3:   iaqi.o3?.v   ?? null,
      co:   iaqi.co?.v   ?? null,
      so2:  iaqi.so2?.v  ?? null,
    };

    const result = {
      aqi,
      level: aqiInfo.level,
      color: aqiInfo.color,
      alert: aqiInfo.alert,
      station: data.city?.name || 'Unknown Station',
      pollutants,
      time: data.time?.s || null,
      dominantPollutant: data.dominentpol || null,
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('AQI API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch AQI data' });
  }
});

module.exports = router;
