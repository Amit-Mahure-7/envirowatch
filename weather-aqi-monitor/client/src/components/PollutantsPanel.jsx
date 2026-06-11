import React from 'react';
import { pollutantPercent, pollutantColor } from '../utils/helpers';
import styles from './PollutantsPanel.module.css';

const POLLUTANT_INFO = [
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', safe: 25,  desc: 'Fine particles' },
  { key: 'pm10', label: 'PM10',  unit: 'µg/m³', safe: 50,  desc: 'Coarse particles' },
  { key: 'no2',  label: 'NO₂',  unit: 'ppb',    safe: 100, desc: 'Nitrogen dioxide' },
  { key: 'o3',   label: 'O₃',   unit: 'ppb',    safe: 70,  desc: 'Ground ozone' },
  { key: 'co',   label: 'CO',   unit: 'ppm',    safe: 4,   desc: 'Carbon monoxide' },
  { key: 'so2',  label: 'SO₂',  unit: 'ppb',    safe: 75,  desc: 'Sulphur dioxide' },
];

export default function PollutantsPanel({ pollutants }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className="section-label">Pollutant Breakdown</div>

      <div className={styles.list}>
        {POLLUTANT_INFO.map(({ key, label, unit, desc }) => {
          const val = pollutants?.[key];
          const pct = val !== null && val !== undefined ? pollutantPercent(key, val) : null;
          const color = pct !== null ? pollutantColor(pct) : '#8892A4';

          return (
            <div key={key} className={styles.item}>
              <div className={styles.itemLeft}>
                <span className={`mono ${styles.itemLabel}`}>{label}</span>
                <span className={styles.itemDesc}>{desc}</span>
              </div>
              <div className={styles.barWrap}>
                <div className={styles.barBg}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: pct !== null ? `${pct}%` : '0%',
                      background: color,
                    }}
                  />
                </div>
              </div>
              <div className={`mono ${styles.itemVal}`} style={{ color }}>
                {val !== null && val !== undefined ? `${val} ${unit}` : 'N/A'}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span style={{ color: '#00D4FF' }}>● Good</span>
        <span style={{ color: '#FF8C42' }}>● Moderate</span>
        <span style={{ color: '#FF4444' }}>● Poor</span>
      </div>
    </div>
  );
}
