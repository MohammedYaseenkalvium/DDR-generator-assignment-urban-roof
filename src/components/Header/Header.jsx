import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">
          🏗
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>DDR Generator</span>
          <span className={styles.brandSub}>Diagnostic Report Builder</span>
        </div>
      </div>

      <div className={styles.badge}>
        <span className={styles.badgeDot} aria-hidden="true" />
        Powered by Gemini AI
      </div>
    </header>
  );
}
