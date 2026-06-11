import React from 'react';
import styles from './MetricsRow.module.css';

function Metric({ icon, label, value, sub, color }) {
  return (
    <div className={`card ${styles.metric}`}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.label}>{label}</div>
      <div className={`mono ${styles.value}`} style={color ? { color } : {}}>
        {value}
      </div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}

export default function MetricsRow({ weather }) {
  if (!weather) return null;

  const cloudiness = weather.cloudiness ?? '--';
  const humidity   = weather.humidity;

  // Comfort level from humidity
  let comfortLabel = 'Comfortable';
  if (humidity > 80) comfortLabel = 'Very humid';
  else if (humidity > 65) comfortLabel = 'Humid';
  else if (humidity < 30) comfortLabel = 'Dry';

  return (
    <div className={styles.row}>
      <Metric
        icon="☁️"
        label="Cloud Cover"
        value={`${cloudiness}%`}
        sub={cloudiness > 70 ? 'Overcast' : cloudiness > 40 ? 'Partly cloudy' : 'Clear'}
      />
      <Metric
        icon="💧"
        label="Humidity"
        value={`${humidity}%`}
        sub={comfortLabel}
      />
      <Metric
        icon="🌬️"
        label="Wind Speed"
        value={`${weather.windSpeed} m/s`}
        sub={`From ${weather.windDeg}°`}
      />
      <Metric
        icon="🌡️"
        label="Temp Range"
        value={`${weather.tempMin}° – ${weather.tempMax}°C`}
        sub="Today's range"
      />
    </div>
  );
}
