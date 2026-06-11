import React, { useState, useEffect } from 'react';
import { timeAgo } from '../utils/helpers';
import styles from './Header.module.css';

export default function Header({ lastUpdated, onRefresh, theme, onToggleTheme }) {
  const [time, setTime]       = useState('');
  const [spinning, setSpinning] = useState(false);
  const [notifStatus, setNotifStatus] = useState('default');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if ('Notification' in window) setNotifStatus(Notification.permission);
  }, []);

  const handleRefresh = () => {
    setSpinning(true);
    onRefresh();
    setTimeout(() => setSpinning(false), 1000);
  };

  const handleNotif = async () => {
    if (!('Notification' in window)) return alert('Browser does not support notifications');
    const perm = await Notification.requestPermission();
    setNotifStatus(perm);
    if (perm === 'granted') {
      new Notification('EnviroWatch', {
        body: '✅ Notifications enabled! You will be alerted when AQI worsens.',
        tag: 'test',
      });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.dot}></span>
        <span className={styles.name}>
          ENVIRO<span className={styles.accent}>WATCH</span>
        </span>
        <span className={styles.liveBadge}>● LIVE</span>
      </div>

      <div className={styles.right}>
        {lastUpdated && (
          <span className={styles.updated}>Updated {timeAgo(lastUpdated)}</span>
        )}
        <span className={styles.clock}>{time}</span>

        {/* Notification bell */}
        <button
          className={styles.iconBtn}
          onClick={handleNotif}
          title={notifStatus === 'granted' ? 'Notifications ON' : 'Enable notifications'}
          style={{ color: notifStatus === 'granted' ? '#00D4FF' : '#8892A4' }}
        >
          {notifStatus === 'granted' ? '🔔' : '🔕'}
        </button>

        {/* Theme toggle */}
        <button
          className={styles.iconBtn}
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>

        <button
          className={`${styles.refreshBtn} ${spinning ? styles.spin : ''}`}
          onClick={handleRefresh}
          title="Refresh data"
        >
          ↻
        </button>
      </div>
    </header>
  );
}
