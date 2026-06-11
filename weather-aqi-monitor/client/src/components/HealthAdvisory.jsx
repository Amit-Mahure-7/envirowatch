import React, { useState } from 'react';
import styles from './HealthAdvisory.module.css';

const ADVISORY_DATA = {
  Good: {
    emoji: '😊',
    color: '#00E400',
    headline: 'Air quality is Good',
    groups: [
      { group: '👶 Children',     advice: 'Safe for all outdoor activities including sports.' },
      { group: '🧓 Elderly',      advice: 'No restrictions. Enjoy outdoor activities freely.' },
      { group: '🫁 Respiratory',  advice: 'No precautions needed. Conditions are ideal.' },
      { group: '🏃 Athletes',     advice: 'Perfect for training and outdoor exercise.' },
    ],
    dos:   ['Enjoy outdoor activities', 'Open windows for fresh air', 'Ideal for morning walks'],
    donts: [],
  },
  Moderate: {
    emoji: '😐',
    color: '#FFFF00',
    headline: 'Air quality is Moderate',
    groups: [
      { group: '👶 Children',     advice: 'Generally safe. Limit intense outdoor activity if sensitive.' },
      { group: '🧓 Elderly',      advice: 'Reduce prolonged exertion outdoors.' },
      { group: '🫁 Respiratory',  advice: 'Unusually sensitive people should consider limiting outdoor activity.' },
      { group: '🏃 Athletes',     advice: 'Okay for most. Consider reducing intensity of long workouts.' },
    ],
    dos:   ['Wear N95 mask if sensitive', 'Keep windows closed during peak hours', 'Stay hydrated'],
    donts: ['Avoid burning wood/trash', 'Limit strenuous activity if you feel discomfort'],
  },
  'Unhealthy for Sensitive Groups': {
    emoji: '😷',
    color: '#FF7E00',
    headline: 'Unhealthy for Sensitive Groups',
    groups: [
      { group: '👶 Children',     advice: 'Reduce prolonged or heavy outdoor exertion.' },
      { group: '🧓 Elderly',      advice: 'Avoid prolonged outdoor exertion. Stay indoors if possible.' },
      { group: '🫁 Respiratory',  advice: 'Move activities indoors. Keep rescue medication handy.' },
      { group: '🏃 Athletes',     advice: 'Consider moving workouts indoors today.' },
    ],
    dos:   ['Wear N95/KN95 mask outdoors', 'Use air purifier indoors', 'Keep windows shut', 'Check medication'],
    donts: ['Avoid outdoor exercise if you are sensitive', 'Do not burn anything outdoors'],
  },
  Unhealthy: {
    emoji: '🤢',
    color: '#FF0000',
    headline: 'Air is Unhealthy — Take Precautions',
    groups: [
      { group: '👶 Children',     advice: 'Keep indoors. No outdoor play or sports today.' },
      { group: '🧓 Elderly',      advice: 'Stay indoors. Avoid all outdoor physical activity.' },
      { group: '🫁 Respiratory',  advice: 'Remain indoors. Contact doctor if symptoms worsen.' },
      { group: '🏃 Athletes',     advice: 'All outdoor training should be cancelled today.' },
    ],
    dos:   ['Stay indoors as much as possible', 'Run air purifier on high', 'Seal window gaps', 'Wear N95 if must go out'],
    donts: ['Do not exercise outdoors', 'Avoid opening windows', 'No outdoor gatherings'],
  },
  'Very Unhealthy': {
    emoji: '☣️',
    color: '#99004C',
    headline: 'Very Unhealthy — Avoid Outdoors',
    groups: [
      { group: '👶 Children',     advice: 'Must stay indoors. School outdoor activities cancelled.' },
      { group: '🧓 Elderly',      advice: 'Do not go outside under any circumstances.' },
      { group: '🫁 Respiratory',  advice: 'Emergency precautions. Seek medical help if symptoms appear.' },
      { group: '🏃 Athletes',     advice: 'No outdoor activity whatsoever.' },
    ],
    dos:   ['Stay completely indoors', 'N95 mandatory if going out', 'Run purifier continuously', 'Drink plenty of water'],
    donts: ['Do not go outside', 'No outdoor activity for anyone', 'Avoid opening doors/windows'],
  },
  Hazardous: {
    emoji: '🚨',
    color: '#7E0023',
    headline: 'HAZARDOUS — Emergency Level',
    groups: [
      { group: '👶 Children',     advice: 'Absolute indoor confinement. Health emergency.' },
      { group: '🧓 Elderly',      advice: 'Do not leave home. Seek medical help immediately if unwell.' },
      { group: '🫁 Respiratory',  advice: 'Call emergency services if experiencing difficulty breathing.' },
      { group: '🏃 Athletes',     advice: 'No outdoor activity. Treat as a public health emergency.' },
    ],
    dos:   ['Stay indoors — this is an emergency', 'Seal all gaps in doors/windows', 'Call doctor if feeling unwell'],
    donts: ['Do not go outside for any reason', 'Do not open windows or doors'],
  },
};

export default function HealthAdvisory({ aqi }) {
  const [expanded, setExpanded] = useState(false);
  const level = aqi?.level || 'Good';
  const info = ADVISORY_DATA[level] || ADVISORY_DATA['Moderate'];

  return (
    <div className={styles.card} style={{ borderColor: info.color + '44' }}>
      <div className={styles.header} onClick={() => setExpanded(e => !e)}>
        <div className={styles.left}>
          <span className={styles.emoji}>{info.emoji}</span>
          <div>
            <div className="section-label" style={{ marginBottom: 2 }}>Health Advisory</div>
            <div className={styles.headline} style={{ color: info.color }}>{info.headline}</div>
          </div>
        </div>
        <span className={styles.toggle}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className={styles.body}>
          {/* Group-wise advice */}
          <div className={styles.groups}>
            {info.groups.map(g => (
              <div key={g.group} className={styles.groupItem}>
                <span className={styles.groupName}>{g.group}</span>
                <span className={styles.groupAdvice}>{g.advice}</span>
              </div>
            ))}
          </div>

          {/* Do's and Don'ts */}
          <div className={styles.dosdonts}>
            {info.dos.length > 0 && (
              <div className={styles.col}>
                <div className={styles.colTitle} style={{ color: '#00E400' }}>✅ Do's</div>
                {info.dos.map(d => (
                  <div key={d} className={styles.doItem}>• {d}</div>
                ))}
              </div>
            )}
            {info.donts.length > 0 && (
              <div className={styles.col}>
                <div className={styles.colTitle} style={{ color: '#FF4444' }}>❌ Don'ts</div>
                {info.donts.map(d => (
                  <div key={d} className={styles.dontItem}>• {d}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
