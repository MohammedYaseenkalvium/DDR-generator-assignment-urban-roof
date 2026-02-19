import React, { useRef, useState } from 'react';
import styles from './FileUpload.module.css';

/**
 * FileUpload
 *
 * Drag-and-drop + click-to-upload card for a single PDF file.
 *
 * @param {string}      id               - Unique identifier (used for the hidden input).
 * @param {string}      label            - Small label above the card (e.g. "Document 1").
 * @param {string}      title            - Card title (e.g. "Inspection Report").
 * @param {string}      icon             - Emoji icon shown in the drop zone.
 * @param {string}      description      - Helper text shown in the drop zone.
 * @param {File|null}   file             - Currently selected file, or null.
 * @param {number}      extractedLength  - Character count after PDF extraction.
 * @param {Function}    onChange         - Called with the selected File object.
 */
export default function FileUpload({
  id,
  label,
  title,
  icon,
  description,
  file,
  extractedLength,
  onChange,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // ─── Drag handlers ─────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      onChange(droppedFile);
    }
  };

  // ─── Click to pick ─────────────────────────────────────────
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onChange(selected);
  };

  // ─── Helpers ───────────────────────────────────────────────
  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatChars = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  const isExtracting = file && extractedLength === 0;
  const isReady = file && extractedLength > 0;

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.label}>{label}</span>
        <h3 className={styles.title}>
          {icon} {title}
        </h3>
      </div>

      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${
          file ? styles.hasFile : ''
        }`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${title} PDF`}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <span className={styles.dropIcon} aria-hidden="true">
          {file ? '📄' : '⬆️'}
        </span>
        <p className={styles.dropPrimary}>
          {file ? (
            <>File selected</>
          ) : (
            <>
              <strong>Click to upload</strong> or drag &amp; drop
            </>
          )}
        </p>
        <p className={styles.dropSecondary}>
          {file ? file.name : description}
        </p>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        id={`file-input-${id}`}
        type="file"
        accept="application/pdf"
        className={styles.hiddenInput}
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Status row */}
      {file && (
        <div
          className={`${styles.statusRow} ${
            isExtracting
              ? styles.statusExtracting
              : isReady
              ? styles.statusReady
              : ''
          }`}
        >
          {isExtracting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Extracting text…</span>
            </>
          ) : (
            <>
              <span className={styles.checkmark} aria-hidden="true">
                ✓
              </span>
              <span>
                {formatBytes(file.size)} &mdash;{' '}
                <strong>{formatChars(extractedLength)} chars</strong> extracted
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
