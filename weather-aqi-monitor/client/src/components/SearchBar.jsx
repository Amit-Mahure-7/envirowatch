import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const QUICK_CITIES = ['Nagpur', 'Mumbai', 'Delhi', 'Pune', 'Bengaluru', 'Hyderabad'];

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Will trigger re-fetch via coordinates in the hook
        // Here we just reload with coords by calling a special search
        onSearch(`${pos.coords.latitude},${pos.coords.longitude}`);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search city…  (e.g. Nagpur, Mumbai, Delhi)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.btn}>Search</button>
        <button
          type="button"
          className={`${styles.btn} ${styles.gpsBtn}`}
          onClick={handleGPS}
          title="Use my location"
        >
          {locating ? '...' : '📍'}
        </button>
      </form>

      <div className={styles.quickLinks}>
        {QUICK_CITIES.map(city => (
          <button
            key={city}
            className={styles.quickBtn}
            onClick={() => onSearch(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
