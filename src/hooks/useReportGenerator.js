/**
 * useReportGenerator.js
 *
 * Custom React hook that manages all state and logic for the DDR generator:
 * - API key input
 * - File uploads + PDF text extraction
 * - Gemini API call
 * - Status tracking
 * - Report output
 */

import { useState, useCallback } from 'react';
import { extractTextFromPDF } from '../services/pdfService.js';
import { generateDDRReport } from '../services/geminiService.js';
import { SAMPLE_INSPECTION_TEXT, SAMPLE_THERMAL_TEXT } from '../constants/sampleData.js';

/**
 * @typedef {Object} FileState
 * @property {File|null} inspection          - Uploaded inspection PDF file.
 * @property {File|null} thermal             - Uploaded thermal images PDF file.
 * @property {number}    inspectionTextLength - Character count after extraction.
 * @property {number}    thermalTextLength    - Character count after extraction.
 */

/**
 * @typedef {'idle'|'loading'|'success'|'error'} StatusType
 */

/**
 * @typedef {Object} Status
 * @property {StatusType} type    - Current status type.
 * @property {string}     message - Human-readable message.
 * @property {string}     step    - Sub-step description for loading state.
 */

const INITIAL_FILES = {
  inspection: null,
  thermal: null,
  inspectionTextLength: 0,
  thermalTextLength: 0,
};

const INITIAL_STATUS = {
  type: '',     // '' means hidden
  message: '',
  step: '',
};

// Internal store for extracted text (not kept in React state to avoid large re-renders)
const extractedTexts = {
  inspection: '',
  thermal: '',
};

export function useReportGenerator() {
  const [apiKey, setApiKey] = useState(
    // Pre-fill from .env if provided (optional)
    import.meta.env.VITE_GEMINI_API_KEY || ''
  );

  const [files, setFiles] = useState(INITIAL_FILES);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [report, setReport] = useState('');

  // ─── Handle file upload + extraction ──────────────────────
  const handleFileChange = useCallback(async (type, file) => {
    if (!file) return;

    // Mark file as selected immediately (shows file name in UI)
    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));

    try {
      const text = await extractTextFromPDF(file);
      extractedTexts[type] = text;

      setFiles((prev) => ({
        ...prev,
        [`${type}TextLength`]: text.length,
      }));
    } catch (err) {
      console.error(`PDF extraction failed for ${type}:`, err);
      // Still keep the file reference; Gemini can still be called without text
      extractedTexts[type] = '';
      setFiles((prev) => ({
        ...prev,
        [`${type}TextLength`]: 0,
      }));
    }
  }, []);

  // ─── Load pre-bundled sample data ─────────────────────────
  const loadSampleData = useCallback(async () => {
    setStatus({
      type: 'loading',
      message: 'Loading sample documents...',
      step: 'Fetching Sample Report.pdf and Thermal Images.pdf',
    });

    try {
      // Fetch the files from the public folder
      const [inspectionRes, thermalRes] = await Promise.all([
        fetch('/Sample Report.pdf'),
        fetch('/Thermal Images.pdf'),
      ]);

      if (!inspectionRes.ok || !thermalRes.ok) {
        throw new Error('Failed to fetch sample PDF files from the public folder.');
      }

      const [inspectionBlob, thermalBlob] = await Promise.all([
        inspectionRes.blob(),
        thermalRes.blob(),
      ]);

      const inspectionFile = new File([inspectionBlob], 'Sample Report.pdf', { type: 'application/pdf' });
      const thermalFile = new File([thermalBlob], 'Thermal Images.pdf', { type: 'application/pdf' });

      setStatus({
        type: 'loading',
        message: 'Extracting text from samples...',
        step: 'Processing PDF content using pdf.js',
      });

      const [inspectionText, thermalText] = await Promise.all([
        extractTextFromPDF(inspectionFile),
        extractTextFromPDF(thermalFile),
      ]);

      extractedTexts.inspection = inspectionText;
      extractedTexts.thermal = thermalText;

      setFiles({
        inspection: inspectionFile,
        thermal: thermalFile,
        inspectionTextLength: inspectionText.length,
        thermalTextLength: thermalText.length,
      });

      setStatus({
        type: 'success',
        message: 'Sample data loaded successfully from public folder.',
        step: 'Click "Generate DDR Report" to continue.',
      });
      setReport('');
    } catch (err) {
      console.error('Failed to load sample data:', err);
      setStatus({
        type: 'error',
        message: `Failed to load sample data: ${err.message}`,
        step: 'Please ensure Sample Report.pdf and Thermal Images.pdf exist in the public folder.',
      });
    }
  }, []);


  // ─── Generate report via Gemini ────────────────────────────
  const generateReport = useCallback(async () => {
    setReport('');
    setStatus({ type: 'loading', message: 'Preparing documents…', step: 'Step 1 of 3 — Combining source data' });

    try {
      await new Promise((r) => setTimeout(r, 400)); // Small delay for UX
      setStatus({ type: 'loading', message: 'Sending to Gemini AI…', step: 'Step 2 of 3 — AI analysis in progress' });

      const generatedMarkdown = await generateDDRReport(
        apiKey,
        extractedTexts.inspection,
        extractedTexts.thermal
      );

      setStatus({ type: 'loading', message: 'Rendering report…', step: 'Step 3 of 3 — Formatting output' });
      await new Promise((r) => setTimeout(r, 300));

      setReport(generatedMarkdown);
      setStatus({
        type: 'success',
        message: '✅ Report generated successfully!',
        step: 'Scroll down to view the full DDR report.',
      });

      // Smooth scroll to report after short delay
      setTimeout(() => {
        document.getElementById('report-output')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);

    } catch (err) {
      setStatus({
        type: 'error',
        message: `Error: ${err.message}`,
        step: 'Please check your API key and try again.',
      });
    }
  }, [apiKey]);

  return {
    apiKey,
    setApiKey,
    files,
    status,
    report,
    handleFileChange,
    loadSampleData,
    generateReport,
  };
}
