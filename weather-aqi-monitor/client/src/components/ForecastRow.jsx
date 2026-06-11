import React from 'react';
import { getWeatherIconUrl } from '../utils/helpers';
import styles from './ForecastRow.module.css';

export default function ForecastRow({ days }) {
  if (!days || days.length === 0) return null;

  return (
    <div className={`card ${styles.card}`}>
      <div className="section-label">5-Day Forecast</div>
      <div className={styles.row}>
        {days.map((day, i) => (
          <div key={day.date} className={`${styles.dayCard} ${i === 0 ? styles.today : ''}`}>
            <div className={styles.dayLabel}>
              {i === 0 ? 'Today' : day.dayLabel}
            </div>
            <img
              src={getWeatherIconUrl(day.icon)}
              alt={day.description}
              className={styles.icon}
            />
            <div className={`mono ${styles.tempMax}`}>{day.tempMax}°</div>
            <div className={`mono ${styles.tempMin}`}>{day.tempMin}°</div>
            <div className={styles.desc}>{day.description}</div>
            {day.pop > 0 && (
              <div className={styles.pop}>💧 {day.pop}%</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
