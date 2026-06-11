import React from 'react';
import { useWeatherData } from './hooks/useWeatherData';
import { useNotifications } from './hooks/useNotifications';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import AQIGauge from './components/AQIGauge';
import MetricsRow from './components/MetricsRow';
import PollutantsPanel from './components/PollutantsPanel';
import TempChart from './components/TempChart';
import ForecastRow from './components/ForecastRow';
import AlertBanner from './components/AlertBanner';
import HealthAdvisory from './components/HealthAdvisory';
import CityCompare from './components/CityCompare';
import Top100Cities from './components/Top100Cities';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import styles from './App.module.css';

export default function App() {
  const { weather, aqi, forecast, loading, error, lastUpdated, searchCity, refresh } = useWeatherData();
  const { theme, toggle: toggleTheme } = useTheme();

  // Auto browser notifications when AQI worsens
  useNotifications(aqi);

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen message={error} onRetry={refresh} />;

  return (
    <div className={styles.app}>
      <div className={styles.container}>

        <Header
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <SearchBar onSearch={searchCity} />

        {aqi?.alert && <AlertBanner aqi={aqi} />}

        {/* Row 1: Weather + AQI */}
        <div className={styles.topGrid}>
          <WeatherCard weather={weather} />
          <AQIGauge aqi={aqi} />
        </div>

        {/* Row 2: Quick metrics */}
        <MetricsRow weather={weather} />

        {/* Row 3: Health Advisory (collapsible) */}
        <HealthAdvisory aqi={aqi} />

        {/* Row 4: Pollutants + Chart */}
        <div className={styles.midGrid}>
          <PollutantsPanel pollutants={aqi?.pollutants} />
          <TempChart hourly={forecast?.hourly} />
        </div>

        {/* Row 5: Forecast */}
        <ForecastRow days={forecast?.days} />

        {/* Row 6: Compare 2 cities */}
        <CityCompare />

        {/* Row 7: Top 50 Hottest & Coldest cities */}
        <Top100Cities />

        <footer className={styles.footer}>
          Data: OpenWeatherMap · WAQI · Auto-refresh every 10 min
        </footer>

      </div>
    </div>
  );
}
