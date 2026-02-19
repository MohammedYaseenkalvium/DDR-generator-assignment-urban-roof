/**
 * useReportGenerator.js
 *
 * Improved version:
 * - Extracted text stored in React state
 * - Validation before Gemini call
 * - No silent empty payloads
 * - Safer architecture
 */

import { useState, useCallback } from 'react';
import { extractTextFromPDF } from '../services/pdfService.js';
import { generateDDRReport } from '../services/geminiService.js';

const INITIAL_FILES = {
  inspection: null,
  thermal: null,
  inspectionTextLength: 0,
  thermalTextLength: 0,
};

const INITIAL_STATUS = {
  type: '',
  message: '',
  step: '',
};

export function useReportGenerator() {
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_GEMINI_API_KEY || ''
  );

  const [files, setFiles] = useState(INITIAL_FILES);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [report, setReport] = useState('');

  // ✅ Store extracted text in state (FIXED ARCHITECTURE)
  const [inspectionText, setInspectionText] = useState('');
  const [thermalText, setThermalText] = useState('');

  // ─────────────────────────────────────────────
  // Handle file upload + extraction
  // ─────────────────────────────────────────────
  const handleFileChange = useCallback(async (type, file) => {
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));

    try {
      const text = await extractTextFromPDF(file);

      if (type === 'inspection') {
        setInspectionText(text);
      } else {
        setThermalText(text);
      }

      setFiles((prev) => ({
        ...prev,
        [`${type}TextLength`]: text.length,
      }));
    } catch (err) {
      console.error(`PDF extraction failed for ${type}:`, err);

      if (type === 'inspection') {
        setInspectionText('');
      } else {
        setThermalText('');
      }

      setFiles((prev) => ({
        ...prev,
        [`${type}TextLength`]: 0,
      }));
    }
  }, []);

  // ─────────────────────────────────────────────
  // Load sample data from public folder
  // ─────────────────────────────────────────────
  const loadSampleData = useCallback(async () => {
    setStatus({
      type: 'loading',
      message: 'Loading sample documents...',
      step: 'Fetching PDFs from public folder',
    });

    try {
      const [inspectionRes, thermalRes] = await Promise.all([
        fetch('/Sample Report.pdf'),
        fetch('/Thermal Images.pdf'),
      ]);

      if (!inspectionRes.ok || !thermalRes.ok) {
        throw new Error('Failed to fetch sample PDF files.');
      }

      const [inspectionBlob, thermalBlob] = await Promise.all([
        inspectionRes.blob(),
        thermalRes.blob(),
      ]);

      const inspectionFile = new File([inspectionBlob], 'Sample Report.pdf', {
        type: 'application/pdf',
      });

      const thermalFile = new File([thermalBlob], 'Thermal Images.pdf', {
        type: 'application/pdf',
      });

      setStatus({
        type: 'loading',
        message: 'Extracting text from samples...',
        step: 'Processing PDF content',
      });

      const [inspectionTextData, thermalTextData] = await Promise.all([
        extractTextFromPDF(inspectionFile),
        extractTextFromPDF(thermalFile),
      ]);

      // ✅ Store in state
      setInspectionText(inspectionTextData);
      setThermalText(thermalTextData);

      setFiles({
        inspection: inspectionFile,
        thermal: thermalFile,
        inspectionTextLength: inspectionTextData.length,
        thermalTextLength: thermalTextData.length,
      });

      setStatus({
        type: 'success',
        message: 'Sample data loaded successfully.',
        step: 'Click "Generate DDR Report" to continue.',
      });

      setReport('');
    } catch (err) {
      console.error('Failed to load sample data:', err);
      setStatus({
        type: 'error',
        message: `Failed to load sample data: ${err.message}`,
        step: 'Ensure sample PDFs exist in public folder.',
      });
    }
  }, []);

  // ─────────────────────────────────────────────
  // Generate DDR report via Gemini
  // ─────────────────────────────────────────────
  const generateReport = useCallback(async () => {
    setReport('');
    setStatus({
      type: 'loading',
      message: 'Preparing documents…',
      step: 'Step 1 of 3 — Validating input',
    });

    try {
      // ✅ VALIDATION (prevents "Not provided" bug)
      if (!inspectionText.trim()) {
        throw new Error(
          'Inspection text is empty. Please upload or load sample data first.'
        );
      }

      if (!thermalText.trim()) {
        throw new Error(
          'Thermal text is empty. Please upload or load sample data first.'
        );
      }

      await new Promise((r) => setTimeout(r, 300));

      setStatus({
        type: 'loading',
        message: 'Sending to Gemini AI…',
        step: 'Step 2 of 3 — AI analysis in progress',
      });

      const generatedMarkdown = await generateDDRReport(
        apiKey,
        inspectionText,
        thermalText
      );

      setStatus({
        type: 'loading',
        message: 'Rendering report…',
        step: 'Step 3 of 3 — Formatting output',
      });

      await new Promise((r) => setTimeout(r, 300));

      setReport(generatedMarkdown);

      setStatus({
        type: 'success',
        message: '✅ Report generated successfully!',
        step: 'Scroll down to view the full DDR report.',
      });

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
        step: 'Please resolve the issue and try again.',
      });
    }
  }, [apiKey, inspectionText, thermalText]);

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
