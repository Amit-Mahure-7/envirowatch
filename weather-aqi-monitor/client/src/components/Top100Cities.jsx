const API_BASE = import.meta.env.VITE_API_URL || '';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tempColor } from '../utils/helpers';
import styles from './Top100Cities.module.css';

// World's most tracked cities for temperature extremes
const CITIES_LIST = [
  // India
  'Delhi','Mumbai','Chennai','Kolkata','Hyderabad','Bengaluru','Ahmedabad','Jaipur',
  'Nagpur','Pune','Lucknow','Bhopal','Indore','Patna','Surat','Vadodara',
  // Hot world cities
  'Kuwait City','Riyadh','Dubai','Doha','Baghdad','Karachi','Cairo','Phoenix',
  'Las Vegas','Muscat','Khartoum','Jacobabad','Turbat','Nawabshah','Sukkur',
  'Medina','Mecca','Ahvaz','Abadan','Bandar Abbas',
  // Cold world cities
  'Yakutsk','Oymyakon','Verkhoyansk','Norilsk','Murmansk','Fairbanks','Barrow',
  'Yellowknife','Ulaanbaatar','Astana','Harbin','Irkutsk','Chita','Magadan',
  'Reykjavik','Tromsø','Rovaniemi','Helsinki','Oslo','Stockholm',
  // Other major cities
  'Tokyo','Beijing','Shanghai','Bangkok','Singapore','Jakarta','Dhaka',
  'Islamabad','Kathmandu','Colombo','Nairobi','Lagos','Johannesburg','Casablanca',
  'Istanbul','Athens','Rome','Madrid','Paris','London','Berlin','Moscow',
  'New York','Los Angeles','Chicago','Miami','Toronto','Sydney','Melbourne',
];

export default function Top100Cities() {
  const [open, setOpen]       = useState(false);
  const [tab, setTab]         = useState('hottest'); // 'hottest' | 'coldest'
  const [cities, setCities]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded]   = useState(false);

  const load = async () => {
    if (loaded) return;
    setLoading(true);

    // Fetch in batches of 10 to avoid rate limits
    const results = [];
    const batch = async (list) => {
      const settled = await Promise.allSettled(
        list.map(city => axios.get(`${API_BASE}/api/weather`, { params: { city } }))
      );
      settled.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          results.push({
            city: r.value.data.city,
            country: r.value.data.country,
            temp: r.value.data.temp,
            description: r.value.data.description,
            icon: r.value.data.icon,
          });
        }
      });
    };

    // Batch into groups of 10
    for (let i = 0; i < CITIES_LIST.length; i += 10) {
      await batch(CITIES_LIST.slice(i, i + 10));
    }

    setCities(results);
    setLoaded(true);
    setLoading(false);
  };

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open) load();
  };

  const sorted = [...cities].sort((a, b) =>
    tab === 'hottest' ? b.temp - a.temp : a.temp - b.temp
  ).slice(0, 50);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toggleBar} onClick={handleOpen}>
        <span className={styles.toggleIcon}>{tab === 'hottest' ? '🔥' : '🧊'}</span>
        <span className={styles.toggleText}>Top 50 Hottest & Coldest Cities Right Now</span>
        <span className={styles.toggleArrow}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className={styles.panel}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'hottest' ? styles.tabActive : ''}`}
              onClick={() => setTab('hottest')}
              style={tab === 'hottest' ? { borderColor: '#FF4444', color: '#FF4444' } : {}}
            >
              🔥 Hottest
            </button>
            <button
              className={`${styles.tab} ${tab === 'coldest' ? styles.tabActive : ''}`}
              onClick={() => setTab('coldest')}
              style={tab === 'coldest' ? { borderColor: '#00D4FF', color: '#00D4FF' } : {}}
            >
              🧊 Coldest
            </button>
          </div>

          {loading && (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <span>Fetching live temperatures from {CITIES_LIST.length} cities…</span>
            </div>
          )}

          {!loading && sorted.length > 0 && (
            <div className={styles.list}>
              {sorted.map((c, i) => (
                <div key={`${c.city}-${i}`} className={styles.row}>
                  <span className={styles.rank}>#{i + 1}</span>
                  <img
                    src={`https://openweathermap.org/img/wn/${c.icon}.png`}
                    alt=""
                    className={styles.icon}
                  />
                  <div className={styles.cityInfo}>
                    <span className={styles.cityName}>{c.city}</span>
                    <span className={styles.country}>{c.country}</span>
                  </div>
                  <span className={styles.desc}>{c.description}</span>
                  <span
                    className={`mono ${styles.temp}`}
                    style={{ color: tempColor(c.temp) }}
                  >
                    {c.temp}°C
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
