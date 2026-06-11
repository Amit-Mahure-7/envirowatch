import React, { useState } from 'react';
import { getAQIInfo } from '../utils/helpers';
import styles from './AlertBanner.module.css';

export default function AlertBanner({ aqi }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !aqi) return null;

  const info = getAQIInfo(aqi.aqi);
  const isHigh = aqi.aqi > 150;

  const advice = aqi.aqi > 200
    ? 'Everyone should avoid outdoor activity. Stay indoors with windows closed.'
    : aqi.aqi > 150
    ? 'Sensitive groups (elderly, children, people with respiratory conditions) should limit outdoor exposure.'
    : 'Unusually sensitive people should consider limiting prolonged outdoor exertion.';

  return (
    <div
      className={styles.banner}
      style={{
        borderColor: `${info.color}44`,
        background: `${info.color}14`,
      }}
    >
      <span className={styles.icon}>{isHigh ? '🔴' : '⚠️'}</span>
      <div className={styles.content}>
        <strong className={styles.title} style={{ color: info.color }}>
          Air Quality Alert — {info.level}
        </strong>
        <span className={styles.text}>{advice}</span>
      </div>
      <button
        className={styles.close}
        onClick={() => setDismissed(true)}
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
