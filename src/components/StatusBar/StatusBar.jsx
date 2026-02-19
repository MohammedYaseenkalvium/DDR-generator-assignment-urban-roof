import React from 'react';
import styles from './StatusBar.module.css';

/**
 * StatusBar
 *
 * Displays the current processing status with an icon, message, and sub-step.
 *
 * @param {'loading'|'success'|'error'} type    - Controls styling and icon.
 * @param {string}                      message - Main status message.
 * @param {string}                      step    - Sub-step or context text.
 */
export default function StatusBar({ type, message, step }) {
  if (!type) return null;

  const icons = {
    loading: <span className={styles.spinner} aria-hidden="true" />,
    success: <span className={styles.icon} aria-hidden="true">✅</span>,
    error:   <span className={styles.icon} aria-hidden="true">❌</span>,
  };

  return (
    <div
      className={`${styles.bar} ${styles[type]}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {icons[type]}

      <div className={styles.text}>
        <p className={styles.message}>{message}</p>
        {step && <p className={styles.step}>{step}</p>}
      </div>
    </div>
  );
}
