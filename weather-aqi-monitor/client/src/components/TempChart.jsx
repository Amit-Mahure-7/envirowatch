import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './TempChart.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function TempChart({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return (
      <div className={`card ${styles.card}`}>
        <div className="section-label">24H Temperature Trend</div>
        <div className={styles.empty}>No hourly data available</div>
      </div>
    );
  }

  const labels = hourly.map(h => h.time);
  const temps  = hourly.map(h => h.temp);
  const humids = hourly.map(h => h.humidity);

  const data = {
    labels,
    datasets: [
      {
        label: 'Temp °C',
        data: temps,
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0,212,255,0.1)',
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: '#00D4FF',
        fill: true,
        tension: 0.4,
        yAxisID: 'yTemp',
      },
      {
        label: 'Humidity %',
        data: humids,
        borderColor: '#FF8C42',
        backgroundColor: 'rgba(255,140,66,0.05)',
        borderWidth: 1.5,
        pointRadius: 1,
        borderDash: [4, 3],
        fill: false,
        tension: 0.4,
        yAxisID: 'yHumid',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E2A45',
        borderColor: 'rgba(0,212,255,0.2)',
        borderWidth: 1,
        titleColor: '#8892A4',
        bodyColor: '#E2E8F0',
        callbacks: {
          label: ctx => {
            if (ctx.datasetIndex === 0) return ` Temp: ${ctx.parsed.y}°C`;
            return ` Humidity: ${ctx.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#8892A4',
          font: { size: 9, family: 'JetBrains Mono' },
          maxTicksLimit: 8,
        },
      },
      yTemp: {
        position: 'left',
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#00D4FF',
          font: { size: 9, family: 'JetBrains Mono' },
          callback: v => v + '°',
        },
      },
      yHumid: {
        position: 'right',
        grid: { display: false },
        ticks: {
          color: '#FF8C42',
          font: { size: 9, family: 'JetBrains Mono' },
          callback: v => v + '%',
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.titleRow}>
        <span className="section-label" style={{ marginBottom: 0 }}>24H Temperature Trend</span>
        <div className={styles.legend}>
          <span style={{ color: '#00D4FF' }}>— Temp</span>
          <span style={{ color: '#FF8C42' }}>-- Humidity</span>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <Line
          data={data}
          options={options}
          aria-label="24-hour temperature and humidity trend chart"
        />
      </div>
    </div>
  );
}
