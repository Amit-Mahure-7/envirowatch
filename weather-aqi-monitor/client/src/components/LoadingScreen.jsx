import React from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      <div className={styles.brand}>
        ENVIRO<span className={styles.accent}>WATCH</span>
      </div>
      <div className={styles.text}>Fetching live environmental data…</div>
    </div>
  );
}
