import React, { useRef, useState } from 'react';
import { markdownToHtml } from '../../utils/markdownToHtml.js';
import styles from './ReportOutput.module.css';

/**
 * ReportOutput
 *
 * Renders the generated DDR Markdown report as formatted HTML.
 * Provides copy-to-clipboard and download-as-markdown actions.
 *
 * @param {string} markdown - The Markdown report string from Gemini.
 */
export default function ReportOutput({ markdown }) {
  const [copyLabel, setCopyLabel] = useState('📋 Copy');
  const reportRef = useRef(null);

  if (!markdown) return null;

  const htmlContent = markdownToHtml(markdown);

  // ─── Copy to clipboard ────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyLabel('✅ Copied!');
      setTimeout(() => setCopyLabel('📋 Copy'), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyLabel('✅ Copied!');
      setTimeout(() => setCopyLabel('📋 Copy'), 2500);
    }
  };

  // ─── Download as Markdown file ────────────────────────────
  const handleDownload = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `DDR_Report_${dateStr}.md`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  // ─── Print / Save as PDF ─────────────────────────────────
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container} id="report-output">
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <span className={styles.toolbarIcon} aria-hidden="true">📋</span>
          <h2 className={styles.toolbarTitle}>Generated DDR Report</h2>
        </div>
        <div className={styles.toolbarActions}>
          <button
            className={styles.actionBtn}
            onClick={handleCopy}
            title="Copy report as Markdown"
          >
            {copyLabel}
          </button>
          <button
            className={styles.actionBtn}
            onClick={handleDownload}
            title="Download as .md file"
          >
            ⬇ Download .md
          </button>
          <button
            className={styles.actionBtn}
            onClick={handlePrint}
            title="Print or save as PDF"
          >
            🖨 Print / PDF
          </button>
        </div>
      </div>

      {/* Report Body */}
      <div
        ref={reportRef}
        className={styles.body}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
