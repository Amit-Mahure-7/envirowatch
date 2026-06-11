import React from 'react';
import styles from './ErrorScreen.module.css';

export default function ErrorScreen({ message, onRetry }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.title}>Something went wrong</div>
      <div className={styles.message}>{message}</div>
      <div className={styles.hint}>
        Make sure your <code>.env</code> file has valid API keys and the server is running on port 5000.
      </div>
      <button className={styles.retryBtn} onClick={onRetry}>
        ↻ Try Again
      </button>
    </div>
  );
}
