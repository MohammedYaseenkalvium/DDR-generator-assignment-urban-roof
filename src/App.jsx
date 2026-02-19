import React from 'react';
import Header from './components/Header/Header.jsx';
import ApiKeyInput from './components/ApiKeyInput/ApiKeyInput.jsx';
import FileUpload from './components/FileUpload/FileUpload.jsx';
import StatusBar from './components/StatusBar/StatusBar.jsx';
import ReportOutput from './components/ReportOutput/ReportOutput.jsx';
import { useReportGenerator } from './hooks/useReportGenerator.js';
import styles from './App.module.css';

export default function App() {
  const {
    apiKey,
    setApiKey,
    files,
    status,
    report,
    handleFileChange,
    loadSampleData,
    generateReport,
  } = useReportGenerator();

  const canGenerate =
    apiKey.trim().length > 10 &&
    (files.inspection !== null || files.thermal !== null) &&
    status.type !== 'loading';

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <section className={styles.intro}>
          <h1 className={styles.introHeading}>
            Detailed Diagnostic
            <br />
            <em>Report Generator</em>
          </h1>
          <p className={styles.introSubtext}>
            Upload your inspection report and thermal images PDF, provide your
            Gemini API key, and generate a structured, client-ready DDR report
            in seconds.
          </p>
        </section>

        <section className={styles.configSection}>
          <ApiKeyInput value={apiKey} onChange={setApiKey} />
        </section>

        <section className={styles.uploadSection}>
          <div className={styles.uploadGrid}>
            <FileUpload
              id="inspection"
              label="Document 1"
              title="Inspection Report"
              icon="📋"
              description="Sample / Inspection Report PDF"
              file={files.inspection}
              extractedLength={files.inspectionTextLength}
              onChange={(f) => handleFileChange('inspection', f)}
            />
            <FileUpload
              id="thermal"
              label="Document 2"
              title="Thermal Images"
              icon="🌡️"
              description="Thermal Images / Temperature Report PDF"
              file={files.thermal}
              extractedLength={files.thermalTextLength}
              onChange={(f) => handleFileChange('thermal', f)}
            />
          </div>
        </section>

        <section className={styles.actionsSection}>
          <button
            className={styles.generateBtn}
            onClick={generateReport}
            disabled={!canGenerate}
          >
            <span className={styles.generateBtnIcon}>⚡</span>
            Generate DDR Report
          </button>
          <button
            className={styles.sampleBtn}
            onClick={loadSampleData}
            disabled={status.type === 'loading'}
          >
            📂 Use Sample Data
          </button>
        </section>

        {status.type && (
          <section className={styles.statusSection}>
            <StatusBar type={status.type} message={status.message} step={status.step} />
          </section>
        )}

        {report && (
          <section className={styles.reportSection}>
            <ReportOutput markdown={report} />
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          DDR Report Generator &mdash; Powered by{' '}
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Gemini AI
          </a>
        </p>
      </footer>
    </div>
  );
}
