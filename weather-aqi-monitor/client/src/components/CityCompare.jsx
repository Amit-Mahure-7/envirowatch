const API_BASE = import.meta.env.VITE_API_URL || '';
import React, { useState } from 'react';
import axios from 'axios';
import { getAQIInfo, tempColor, getWeatherIconUrl } from '../utils/helpers';
import styles from './CityCompare.module.css';

async function fetchCityData(city) {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const params = { city };
  const [w, a] = await Promise.all([
    axios.get(`${API_BASE}/api/weather`, { params }),
    axios.get(`${API_BASE}/api/aqi`, { params }),
  ]);
  return { weather: w.data, aqi: a.data };
}

function CityColumn({ data, city, loading, error }) {
  if (loading) return (
    <div className={styles.col}>
      <div className={styles.colLoading}>
        <div className={styles.spinner} />
        <span>Fetching {city}…</span>
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.col}>
      <div className={styles.colError}>⚠️ {error}</div>
    </div>
  );

  if (!data) return (
    <div className={styles.col}>
      <div className={styles.colEmpty}>Enter a city to compare</div>
    </div>
  );

  const { weather, aqi } = data;
  const aqiInfo = getAQIInfo(aqi?.aqi);

  return (
    <div className={styles.col}>
      <div className={styles.cityName}>{weather.city}, {weather.country}</div>

      <div className={styles.tempRow}>
        <img src={getWeatherIconUrl(weather.icon)} alt="" className={styles.icon} />
        <span className={`mono ${styles.temp}`} style={{ color: tempColor(weather.temp) }}>
          {weather.temp}°C
        </span>
      </div>

      <div className={styles.desc}>{weather.description}</div>

      <div className={styles.aqiBadge} style={{ background: aqiInfo.color + '22', borderColor: aqiInfo.color + '66', color: aqiInfo.color }}>
        AQI {aqi?.aqi ?? 'N/A'} — {aqiInfo.level}
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: 'Humidity',   val: `${weather.humidity}%` },
          { label: 'Wind',       val: `${weather.windSpeed} m/s` },
          { label: 'Pressure',   val: `${weather.pressure} hPa` },
          { label: 'Feels Like', val: `${weather.feelsLike}°C` },
          { label: 'PM2.5',      val: aqi?.pollutants?.pm25 ? `${aqi.pollutants.pm25} µg` : 'N/A' },
          { label: 'PM10',       val: aqi?.pollutants?.pm10 ? `${aqi.pollutants.pm10} µg` : 'N/A' },
        ].map(s => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={`mono ${styles.statVal}`}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CityCompare() {
  const [open, setOpen] = useState(false);
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [err1, setErr1] = useState(null);
  const [err2, setErr2] = useState(null);

  const compare = async () => {
    if (!city1 || !city2) return;
    setLoading1(true); setLoading2(true);
    setErr1(null); setErr2(null);
    setData1(null); setData2(null);

    const [r1, r2] = await Promise.allSettled([
      fetchCityData(city1),
      fetchCityData(city2),
    ]);

    if (r1.status === 'fulfilled') setData1(r1.value);
    else setErr1('City not found');
    setLoading1(false);

    if (r2.status === 'fulfilled') setData2(r2.value);
    else setErr2('City not found');
    setLoading2(false);
  };

  // Winner badges
  const getWinner = () => {
    if (!data1 || !data2) return null;
    const results = [];
    if (data1.weather.temp !== data2.weather.temp)
      results.push({ label: '🌡️ Cooler', winner: data1.weather.temp < data2.weather.temp ? data1.weather.city : data2.weather.city });
    if (data1.aqi?.aqi && data2.aqi?.aqi)
      results.push({ label: '💨 Cleaner Air', winner: data1.aqi.aqi < data2.aqi.aqi ? data1.weather.city : data2.weather.city });
    if (data1.weather.humidity !== data2.weather.humidity)
      results.push({ label: '💧 Less Humid', winner: data1.weather.humidity < data2.weather.humidity ? data1.weather.city : data2.weather.city });
    return results;
  };

  const winners = getWinner();

  return (
    <div className={styles.wrapper}>
      <div className={styles.toggleBar} onClick={() => setOpen(o => !o)}>
        <span className={styles.toggleIcon}>📍</span>
        <span className={styles.toggleText}>Compare 2 Cities Side by Side</span>
        <span className={styles.toggleArrow}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className={styles.panel}>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              placeholder="City 1 (e.g. Nagpur)"
              value={city1}
              onChange={e => setCity1(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && compare()}
            />
            <span className={styles.vs}>VS</span>
            <input
              className={styles.input}
              placeholder="City 2 (e.g. Pune)"
              value={city2}
              onChange={e => setCity2(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && compare()}
            />
            <button className={styles.compareBtn} onClick={compare}>
              Compare
            </button>
          </div>

          <div className={styles.colsRow}>
            <CityColumn data={data1} city={city1} loading={loading1} error={err1} />
            <div className={styles.divider} />
            <CityColumn data={data2} city={city2} loading={loading2} error={err2} />
          </div>

          {winners && winners.length > 0 && (
            <div className={styles.winners}>
              <div className={styles.winnersTitle}>🏆 Comparison Results</div>
              <div className={styles.winnersRow}>
                {winners.map(w => (
                  <div key={w.label} className={styles.winnerBadge}>
                    <span className={styles.winnerLabel}>{w.label}</span>
                    <span className={styles.winnerCity}>{w.winner}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
