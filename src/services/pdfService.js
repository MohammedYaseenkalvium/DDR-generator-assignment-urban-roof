/**
 * pdfService.js
 *
 * Handles PDF file reading and text extraction using pdf.js.
 * Configured to use the CDN worker so no local worker file is needed.
 */

// Use the global pdfjsLib provided by the script tag in index.html.
// This bypasses bundling issues with pdfjs-dist in the Vite environment.
const pdfjsLib = window.pdfjsLib;

if (pdfjsLib) {
  // Point pdf.js at the CDN-hosted worker.
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
} else {
  console.error('pdfjsLib not found. Make sure the script tag is correctly added to index.html.');
}






/**
 * Extracts all readable text from a PDF File object.
 *
 * @param {File} file - The PDF file to extract text from.
 * @returns {Promise<string>} Resolved with the full extracted text.
 * @throws {Error} If the file cannot be parsed.
 */
export async function extractTextFromPDF(file) {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Invalid file. Please provide a PDF document.');
  }

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    // Join all text items from the page, preserving line breaks between blocks
    const pageText = textContent.items
      .map((item) => item.str)
      .join(' ');

    pageTexts.push(`--- Page ${pageNumber} ---\n${pageText}`);
  }

  return pageTexts.join('\n\n');
}
