/**
 * markdownToHtml.js
 *
 * A lightweight, purpose-built Markdown → HTML converter for DDR reports.
 * Handles headings, bold, italic, tables, lists, horizontal rules,
 * blockquotes, and severity badge injection.
 *
 * No external dependencies — keeps the bundle lean.
 */

/**
 * Wraps a severity keyword in a styled badge span.
 *
 * @param {string} cellText - Table cell text to check.
 * @returns {string} Original text or text wrapped in a badge span.
 */
function applySeverityBadge(cellText) {
  const text = cellText.trim();
  if (/^high$/i.test(text)) {
    return `<span class="severity-badge severity-high">${text}</span>`;
  }
  if (/^medium$/i.test(text)) {
    return `<span class="severity-badge severity-medium">${text}</span>`;
  }
  if (/^low$/i.test(text)) {
    return `<span class="severity-badge severity-low">${text}</span>`;
  }
  return text;
}

/**
 * Converts a Markdown table block into an HTML table string.
 *
 * @param {string} tableBlock - Raw Markdown table text.
 * @returns {string} HTML table string.
 */
function convertTable(tableBlock) {
  const rows = tableBlock.trim().split('\n');

  if (rows.length < 2) return tableBlock;

  const cleanRows = rows.filter(
    (row) => !/^\|[\s\-|:]+\|$/.test(row.trim())
  );

  if (cleanRows.length < 2) return tableBlock;

  let html = '<div class="table-wrapper"><table>';

  // Header
  const headerCells = cleanRows[0]
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean);

  html += '<thead><tr>';
  headerCells.forEach((cell) => {
    html += `<th>${cell}</th>`;
  });
  html += '</tr></thead><tbody>';

  // Body rows
  for (let i = 1; i < cleanRows.length; i++) {
    const cells = cleanRows[i]
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);

    html += '<tr>';
    cells.forEach((cell) => {
      html += `<td>${applySeverityBadge(cell)}</td>`;
    });
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  return html;
}
/**
 * Converts inline Markdown (bold, italic, inline code, links) within a string.
 *
 * @param {string} text - Raw text with possible inline Markdown.
 * @returns {string} HTML string.
 */
function convertInline(text) {
  return text
    // Bold+Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Links [text](url)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}

/**
 * Main converter: transforms a full Markdown string into an HTML string.
 *
 * @param {string} markdown - The full Markdown document.
 * @returns {string} The converted HTML string.
 */
export function markdownToHtml(markdown) {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const htmlParts = [];

  let i = 0;
  let inList = false;     // Unordered list state
  let inOList = false;    // Ordered list state
  let inBlockquote = false;

  const closeList = () => {
    if (inList) {
      htmlParts.push('</ul>');
      inList = false;
    }
    if (inOList) {
      htmlParts.push('</ol>');
      inOList = false;
    }
  };

  const closeBlockquote = () => {
    if (inBlockquote) {
      htmlParts.push('</blockquote>');
      inBlockquote = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Empty line ───────────────────────────────────────────
    if (trimmed === '') {
      closeList();
      closeBlockquote();
      i++;
      continue;
    }

    // ── Horizontal rule ──────────────────────────────────────
    if (/^---+$/.test(trimmed)) {
      closeList();
      closeBlockquote();
      htmlParts.push('<hr />');
      i++;
      continue;
    }

    // ── Table detection (line starts and ends with |) ────────
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeList();
      closeBlockquote();
      // Collect all consecutive table lines
      const tableLines = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith('|') &&
        lines[i].trim().endsWith('|')
      ) {
        tableLines.push(lines[i]);
        i++;
      }
      htmlParts.push(convertTable(tableLines.join('\n')));
      continue;
    }

    // ── Headings ─────────────────────────────────────────────
    const h4Match = trimmed.match(/^####\s+(.+)$/);
    const h3Match = trimmed.match(/^###\s+(.+)$/);
    const h2Match = trimmed.match(/^##\s+(.+)$/);
    const h1Match = trimmed.match(/^#\s+(.+)$/);

    if (h4Match) {
      closeList(); closeBlockquote();
      htmlParts.push(`<h4>${convertInline(h4Match[1])}</h4>`);
      i++; continue;
    }
    if (h3Match) {
      closeList(); closeBlockquote();
      htmlParts.push(`<h3>${convertInline(h3Match[1])}</h3>`);
      i++; continue;
    }
    if (h2Match) {
      closeList(); closeBlockquote();
      htmlParts.push(`<h2>${convertInline(h2Match[1])}</h2>`);
      i++; continue;
    }
    if (h1Match) {
      closeList(); closeBlockquote();
      htmlParts.push(`<h1>${convertInline(h1Match[1])}</h1>`);
      i++; continue;
    }

    // ── Blockquote ───────────────────────────────────────────
    const bqMatch = trimmed.match(/^>\s*(.*)$/);
    if (bqMatch) {
      closeList();
      if (!inBlockquote) {
        htmlParts.push('<blockquote>');
        inBlockquote = true;
      }
      htmlParts.push(`<p>${convertInline(bqMatch[1])}</p>`);
      i++; continue;
    }

    // ── Unordered list item ──────────────────────────────────
    const ulMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (ulMatch) {
      closeBlockquote();
      if (inOList) { htmlParts.push('</ol>'); inOList = false; }
      if (!inList) { htmlParts.push('<ul>'); inList = true; }
      htmlParts.push(`<li>${convertInline(ulMatch[1])}</li>`);
      i++; continue;
    }

    // ── Ordered list item ────────────────────────────────────
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      closeBlockquote();
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      if (!inOList) { htmlParts.push('<ol>'); inOList = true; }
      htmlParts.push(`<li>${convertInline(olMatch[1])}</li>`);
      i++; continue;
    }

    // ── Paragraph (italic-only line = special citation) ──────
    const italicOnlyMatch = trimmed.match(/^\*([^*].+[^*])\*$/);
    if (italicOnlyMatch) {
      closeList(); closeBlockquote();
      htmlParts.push(`<p class="citation"><em>${convertInline(italicOnlyMatch[1])}</em></p>`);
      i++; continue;
    }

    // ── Regular paragraph ────────────────────────────────────
    closeList();
    closeBlockquote();
    htmlParts.push(`<p>${convertInline(trimmed)}</p>`);
    i++;
  }

  // Close any open containers
  closeList();
  closeBlockquote();

  return htmlParts.join('\n');
}
