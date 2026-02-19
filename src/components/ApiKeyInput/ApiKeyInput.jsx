import React, { useState } from 'react';
import styles from './ApiKeyInput.module.css';

/**
 * ApiKeyInput
 *
 * Controlled input for the Gemini API key.
 * Supports show/hide toggle and links to the key generation page.
 *
 * @param {string}   value    - Current API key value.
 * @param {Function} onChange - Called with the new string value on change.
 */
export default function ApiKeyInput({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  const isValid = value.trim().length > 10;
  const isEmpty = value.trim().length === 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor="gemini-api-key">
          Gemini API Key
        </label>
        <a
          className={styles.helpLink}
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get a free key →
        </a>
      </div>

      <div
        className={`${styles.inputWrapper} ${
          !isEmpty && !isValid ? styles.inputError : ''
        } ${isValid ? styles.inputValid : ''}`}
      >
        <span className={styles.keyIcon} aria-hidden="true">
          🔑
        </span>

        <input
          id="gemini-api-key"
          className={styles.input}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="AIza..."
          spellCheck={false}
          autoComplete="off"
          aria-label="Gemini API key"
        />

        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide API key' : 'Show API key'}
        >
          {visible ? '🙈' : '👁️'}
        </button>

        {isValid && (
          <span className={styles.validCheck} aria-label="Valid key format">
            ✓
          </span>
        )}
      </div>

      <p className={styles.hint}>
        Your key is never stored or sent anywhere other than directly to Google's
        Gemini API.
      </p>
    </div>
  );
}
