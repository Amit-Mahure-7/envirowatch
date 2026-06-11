import React from 'react';
import { getWeatherIconUrl, getWindDirection, formatUnixTime, tempColor } from '../utils/helpers';
import styles from './WeatherCard.module.css';

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const iconUrl = getWeatherIconUrl(weather.icon);
  const windDir = getWindDirection(weather.windDeg);
  const tColor  = tempColor(weather.temp);

  return (
    <div className={`card card--blue ${styles.card}`}>
      <div className="section-label">Current Weather</div>

      <div className={styles.locationRow}>
        <span className={styles.cityName}>{weather.city}, {weather.country}</span>
        <span className={styles.coords}>
          {weather.lat?.toFixed(2)}°N, {weather.lon?.toFixed(2)}°E
        </span>
      </div>

      <div className={styles.mainRow}>
        <div>
          <div className={`mono ${styles.tempBig}`} style={{ color: tColor }}>
            {weather.temp}<span className={styles.unit}>°C</span>
          </div>
          <div className={styles.feelsLike}>Feels like {weather.feelsLike}°C</div>
          <div className={styles.description}>
            {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
          </div>
        </div>
        <img src={iconUrl} alt={weather.description} className={styles.icon} />
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Humidity</span>
          <span className={`mono ${styles.statVal}`}>{weather.humidity}%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Wind</span>
          <span className={`mono ${styles.statVal}`}>{weather.windSpeed} m/s {windDir}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Pressure</span>
          <span className={`mono ${styles.statVal}`}>{weather.pressure} hPa</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Visibility</span>
          <span className={`mono ${styles.statVal}`}>{weather.visibility} km</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Sunrise</span>
          <span className={`mono ${styles.statVal}`}>
            {formatUnixTime(weather.sunrise, weather.timezone)}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Sunset</span>
          <span className={`mono ${styles.statVal}`}>
            {formatUnixTime(weather.sunset, weather.timezone)}
          </span>
        </div>
      </div>

      <div className={styles.minmax}>
        <span className={styles.minLabel}>↓ {weather.tempMin}°C</span>
        <div className={styles.minmaxBar}>
          <div
            className={styles.minmaxFill}
            style={{
              width: `${((weather.temp - weather.tempMin) / Math.max(weather.tempMax - weather.tempMin, 1)) * 100}%`
            }}
          />
        </div>
        <span className={styles.maxLabel}>↑ {weather.tempMax}°C</span>
      </div>
    </div>
  );
}
