import React, { useEffect, useRef } from 'react';
import { getAQIInfo } from '../utils/helpers';
import styles from './AQIGauge.module.css';

function drawGauge(canvas, aqi, color) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 90, cy = 90, r = 70;
  ctx.clearRect(0, 0, 180, 180);

  const startAngle = Math.PI * 0.75;
  const totalArc   = Math.PI * 1.5;
  const pct        = Math.min((aqi || 0) / 500, 1);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, startAngle + totalArc);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Coloured arc
  if (pct > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, startAngle + totalArc * pct);
    ctx.strokeStyle = color;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Dot at tip
    const tipAngle = startAngle + totalArc * pct;
    ctx.beginPath();
    ctx.arc(
      cx + r * Math.cos(tipAngle),
      cy + r * Math.sin(tipAngle),
      7, 0, Math.PI * 2
    );
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}

export default function AQIGauge({ aqi }) {
  const canvasRef = useRef(null);
  const aqiInfo   = getAQIInfo(aqi?.aqi);

  useEffect(() => {
    drawGauge(canvasRef.current, aqi?.aqi, aqiInfo.color);
  }, [aqi, aqiInfo.color]);

  const pollutants = aqi?.pollutants || {};

  return (
    <div className={`card card--amber ${styles.card}`}>
      <div className="section-label">Air Quality Index</div>

      <div className={styles.gaugeRow}>
        <div className={styles.gaugeWrap}>
          <canvas
            ref={canvasRef}
            width={180}
            height={180}
            role="img"
            aria-label={`AQI gauge showing ${aqi?.aqi ?? 'N/A'} — ${aqiInfo.level}`}
          />
          <div className={styles.gaugeCenter}>
            <div className={`mono ${styles.aqiNum}`} style={{ color: aqiInfo.color }}>
              {aqi?.aqi ?? '--'}
            </div>
            <div className={styles.aqiLabel}>AQI</div>
          </div>
        </div>

        <div className={styles.aqiRight}>
          <div className={styles.aqiStatus} style={{ color: aqiInfo.color }}>
            {aqiInfo.emoji} {aqiInfo.level}
          </div>

          <div className={styles.aqiScale}>
            {[
              { label: 'Good',     color: '#00E400' },
              { label: 'Moderate', color: '#FFFF00' },
              { label: 'USG',      color: '#FF7E00' },
              { label: 'Unhlthy', color: '#FF0000' },
              { label: 'Hazard',  color: '#7E0023' },
            ].map(s => (
              <div key={s.label} className={styles.scaleSeg} style={{ background: s.color }}>
                <span className={styles.scaleLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {aqi?.station && (
            <div className={styles.station}>📍 {aqi.station}</div>
          )}

          {aqi?.dominantPollutant && (
            <div className={styles.dominant}>
              Main pollutant: <span className={styles.domVal}>{aqi.dominantPollutant.toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
