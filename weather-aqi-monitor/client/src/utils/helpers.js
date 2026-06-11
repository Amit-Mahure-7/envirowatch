// ── AQI Helpers ─────────────────────────────────────────
export function getAQIInfo(aqi) {
  if (!aqi && aqi !== 0) return { level: 'N/A', color: '#8892A4', emoji: '?', alert: false };
  if (aqi <= 50)  return { level: 'Good',                       color: '#00E400', emoji: '✅', alert: false };
  if (aqi <= 100) return { level: 'Moderate',                   color: '#FFFF00', emoji: '⚠️', alert: false };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#FF7E00', emoji: '⚠️', alert: true };
  if (aqi <= 200) return { level: 'Unhealthy',                  color: '#FF0000', emoji: '🔴', alert: true };
  if (aqi <= 300) return { level: 'Very Unhealthy',             color: '#99004C', emoji: '🔴', alert: true };
  return                 { level: 'Hazardous',                  color: '#7E0023', emoji: '☣️', alert: true };
}

// ── Weather Icon URL ────────────────────────────────────
export function getWeatherIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// ── Wind direction ──────────────────────────────────────
export function getWindDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── UV Index label ──────────────────────────────────────
export function getUVLevel(uv) {
  if (uv <= 2)  return { label: 'Low',       color: '#00E400' };
  if (uv <= 5)  return { label: 'Moderate',  color: '#FFFF00' };
  if (uv <= 7)  return { label: 'High',      color: '#FF7E00' };
  if (uv <= 10) return { label: 'Very High', color: '#FF0000' };
  return               { label: 'Extreme',   color: '#9900CC' };
}

// ── Sunrise/Sunset formatting ───────────────────────────
export function formatUnixTime(unix, timezone = 0) {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
}

// ── Relative time ───────────────────────────────────────
export function timeAgo(date) {
  if (!date) return '';
  const secs = Math.floor((new Date() - date) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

// ── Pollutant safe % for bar display ───────────────────
// Normalised to a "safe limit" for visual display (0-100%)
const POLLUTANT_MAX = { pm25: 150, pm10: 250, no2: 200, o3: 200, co: 10, so2: 500 };
export function pollutantPercent(key, value) {
  if (!value && value !== 0) return 0;
  return Math.min(Math.round((value / POLLUTANT_MAX[key]) * 100), 100);
}

// ── Pollutant color ─────────────────────────────────────
export function pollutantColor(percent) {
  if (percent < 30) return '#00D4FF';
  if (percent < 60) return '#FF8C42';
  return '#FF4444';
}

// ── Temperature gradient color ──────────────────────────
export function tempColor(temp) {
  if (temp <= 10) return '#00BFFF';
  if (temp <= 20) return '#00D4FF';
  if (temp <= 30) return '#FFD700';
  if (temp <= 38) return '#FF8C42';
  return '#FF4444';
}
