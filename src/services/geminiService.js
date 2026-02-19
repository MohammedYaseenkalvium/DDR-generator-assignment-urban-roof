/**
 * geminiService.js
 *
 * Handles all communication with the Google Gemini API.
 * Builds the DDR prompt and returns the generated Markdown report.
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

/**
 * Builds the structured prompt sent to Gemini.
 *
 * @param {string} inspectionText - Extracted text from the inspection report PDF.
 * @param {string} thermalText    - Extracted text from the thermal images PDF.
 * @returns {string} The full prompt string.
 */
function buildDDRPrompt(inspectionText, thermalText) {
  const inspectionSection = inspectionText?.trim()
    ? inspectionText.trim()
    : 'Not provided.';

  const thermalSection = thermalText?.trim()
    ? thermalText.trim()
    : 'Not provided.';

  return `You are a senior building diagnostics expert authoring a Detailed Diagnostic Report (DDR) for a property owner. Your writing is professional, precise, and client-friendly — avoid jargon where possible.

You will be given two source documents:
1. An inspection report with area-wise observations.
2. A thermal imaging report with temperature readings.

Your job is to combine these intelligently into a single, structured DDR.

RULES:
- Do NOT invent or assume any facts not present in the source documents.
- If data is missing or ambiguous, write exactly: "Not Available"
- If data conflicts between the two documents, explicitly note: "Conflicting data — [explanation]"
- Do not duplicate observations across sections.
- Use clear, simple English that a non-technical property owner can understand.
- Use Markdown formatting with headings, tables, and bullet lists.

---

SOURCE DOCUMENT 1 — INSPECTION REPORT:
${inspectionSection}

---

SOURCE DOCUMENT 2 — THERMAL IMAGING REPORT:
${thermalSection}

---

Now generate the complete DDR report using EXACTLY the structure below. Fill every section thoroughly.

# Detailed Diagnostic Report (DDR)

## 1. Property Issue Summary
Write 2–3 paragraphs summarising the overall condition of the property, the main problems found, and their general severity. This is the executive summary a client reads first.

## 2. Area-wise Observations

For each impacted area identified in the inspection, create a sub-section like this:

### [Area Name]
- **Observed Issue (Negative Side):** [What was found on the affected/interior side]
- **Source / Probable Cause (Positive Side):** [What is on the other side causing it]
- **Thermal Reading:** [Temperature hotspot/coldspot and what it suggests, or "Not Available"]
- **Visual Signs:** [Visible indicators — dampness, stains, cracks, peeling paint, etc.]

## 3. Probable Root Causes
For each main category of issue found, explain the most likely root cause in plain language. Group related causes together.

## 4. Severity Assessment

Create a table with the following columns:
| Area | Observed Issue | Severity | Reasoning |

Use these severity levels:
- **High** — Requires immediate attention; structural risk, health hazard, or active water infiltration
- **Medium** — Should be addressed within 1–3 months; progressing issue
- **Low** — Monitor; cosmetic or slow-developing

## 5. Recommended Actions

### Immediate Actions (Within 1–2 weeks)
List actions that must be done urgently.

### Short-term Actions (Within 1–3 months)
List actions to follow up once immediate issues are stabilised.

### Long-term / Preventive Measures
List actions to prevent recurrence or future deterioration.

## 6. Additional Notes
Note any patterns, correlations between thermal data and visual observations, or anything that adds context not captured in the sections above. Note any safety concerns.

## 7. Missing or Unclear Information
List any details that were absent or unclear in the source documents that would be needed for a complete diagnosis. Format each as:
- **[Topic]:** Not Available — [Why this information matters]

---
*This report was generated from: (1) an inspection report and (2) thermal imaging data captured on 27.09.2022. All findings are based solely on the source documents provided. An on-site follow-up inspection is recommended before undertaking repair work.*
`;
}

/**
 * Calls the Gemini API and returns the generated report text.
 *
 * @param {string} apiKey         - The user's Gemini API key.
 * @param {string} inspectionText - Text from the inspection report.
 * @param {string} thermalText    - Text from the thermal images report.
 * @returns {Promise<string>} Resolved with the Markdown report string.
 * @throws {Error} If the API call fails or returns an unexpected response.
 */
export async function generateDDRReport(apiKey, inspectionText, thermalText) {
  if (!apiKey || apiKey.trim().length < 10) {
    throw new Error('A valid Gemini API key is required.');
  }

  const prompt = buildDDRPrompt(inspectionText, thermalText);

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.25,        // Low temperature for factual, structured output
      maxOutputTokens: 4096,
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };


  const url = `${GEMINI_API_URL}?key=${apiKey.trim()}`;

  console.log('Sending request to Gemini API...', url.replace(apiKey, 'REDACTED_KEY'));

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  } catch (fetchErr) {
    console.error('Network error during fetch:', fetchErr);
    throw new Error(`Connection failed. Please check your internet connection or if an ad-blocker is blocking the Gemini API domain. (Details: ${fetchErr.message})`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message ||
      `Gemini API error: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const data = await response.json();

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    const finishReason = data?.candidates?.[0]?.finishReason;
    throw new Error(
      `Gemini returned no content. Finish reason: ${finishReason || 'unknown'}. Check your API key and quota.`
    );
  }

  return text;
}
