import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DEFAULT_CITY = 'Nagpur';
const API_BASE = import.meta.env.VITE_API_URL || '';

export function useWeatherData() {
  const [weather, setWeather]   = useState(null);
  const [aqi, setAqi]           = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [location, setLocation] = useState({ type: 'city', value: DEFAULT_CITY });
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async (loc) => {
    setLoading(true);
    setError(null);

    try {
      let params = {};
      if (loc.type === 'coords') {
        params = { lat: loc.lat, lon: loc.lon };
      } else {
        params = { city: loc.value };
      }

      const [weatherRes, aqiRes, forecastRes] = await Promise.all([
        axios.get(`${API_BASE}/api/weather`, { params }),
        axios.get(`${API_BASE}/api/aqi`, { params }),
        axios.get(`${API_BASE}/api/forecast`, { params }),
      ]);

      setWeather(weatherRes.data);
      setAqi(aqiRes.data);
      setForecast(forecastRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data. Check your API keys.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { type: 'coords', lat: pos.coords.latitude, lon: pos.coords.longitude };
          setLocation(coords);
          fetchAll(coords);
        },
        () => { fetchAll(location); }
      );
    } else {
      fetchAll(location);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => fetchAll(location), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, fetchAll]);

  const searchCity = useCallback((cityName) => {
    const loc = { type: 'city', value: cityName };
    setLocation(loc);
    fetchAll(loc);
  }, [fetchAll]);

  const refresh = useCallback(() => fetchAll(location), [location, fetchAll]);

  return { weather, aqi, forecast, loading, error, lastUpdated, searchCity, refresh };
}