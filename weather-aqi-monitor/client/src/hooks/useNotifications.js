import { useEffect, useRef } from 'react';

export function useNotifications(aqi) {
  const lastAqiRef    = useRef(null);
  const permissionRef = useRef('default');

  // Request permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => {
        permissionRef.current = p;
      });
    } else if ('Notification' in window) {
      permissionRef.current = Notification.permission;
    }
  }, []);

  // Watch AQI and fire notification when it crosses thresholds
  useEffect(() => {
    if (!aqi?.aqi || permissionRef.current !== 'granted') return;

    const current  = aqi.aqi;
    const previous = lastAqiRef.current;

    // Only notify if AQI crossed into a new danger zone
    const getZone = (v) => {
      if (v <= 50)  return 0;
      if (v <= 100) return 1;
      if (v <= 150) return 2;
      if (v <= 200) return 3;
      if (v <= 300) return 4;
      return 5;
    };

    const prevZone = previous !== null ? getZone(previous) : getZone(current);
    const currZone = getZone(current);

    if (previous !== null && currZone > prevZone) {
      const messages = [
        '',
        '',
        '⚠️ AQI is Moderate — Sensitive groups should take care.',
        '🔴 AQI is Unhealthy for Sensitive Groups — Limit outdoor activity.',
        '🚨 AQI is Unhealthy — Everyone should reduce outdoor exposure.',
        '☣️ AQI is Hazardous — Stay indoors immediately!',
      ];

      if (messages[currZone]) {
        new Notification('EnviroWatch Air Quality Alert', {
          body: messages[currZone],
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: 'aqi-alert',
        });
      }
    }

    lastAqiRef.current = current;
  }, [aqi?.aqi]);
}
