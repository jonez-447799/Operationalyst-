const FORMULA_PREFIX_REGEX = /^[\s]*[=+\-@|\t\r\n]/;
const GSTIN_REGEX = /\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]\b/gi;
const PAN_REGEX = /\b[A-Z]{5}\d{4}[A-Z]\b/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const INDIAN_PHONE_REGEX = /(?:\+91[-\s]?|91[-\s]?|0)?\b[6-9]\d{9}\b/g;
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export interface ScrubStats {
  formulaCellsNeutralized: number;
  gstinsRedacted: number;
  pansRedacted: number;
  emailsRedacted: number;
  phonesRedacted: number;
}

export function scrubPiiAndTaxIds(input: unknown, stats?: ScrubStats, redactPan = true): string {
  let text = String(input ?? "").replace(/\0/g, "").trim();
  text = text.replace(GSTIN_REGEX, () => { if (stats) stats.gstinsRedacted += 1; return "[REDACTED-GSTIN]"; });
  if (redactPan) text = text.replace(PAN_REGEX, () => { if (stats) stats.pansRedacted += 1; return "[REDACTED-PAN]"; });
  text = text.replace(EMAIL_REGEX, () => { if (stats) stats.emailsRedacted += 1; return "[REDACTED-EMAIL]"; });
  text = text.replace(INDIAN_PHONE_REGEX, () => { if (stats) stats.phonesRedacted += 1; return "[REDACTED-PHONE]"; });
  return text;
}

export function neutralizeFormulaPrefix(input: string, stats?: ScrubStats): string {
  if (FORMULA_PREFIX_REGEX.test(input)) {
    if (stats) stats.formulaCellsNeutralized += 1;
    return `'${input}`;
  }
  return input;
}

export function sanitizeSpreadsheetCell(raw: unknown, stats?: ScrubStats, redactPan = true): string {
  return neutralizeFormulaPrefix(scrubPiiAndTaxIds(raw, stats, redactPan), stats);
}

export function isSafeHeaderKey(header: string): boolean {
  const normalized = header.trim().toLowerCase();
  return normalized.length > 0 && !FORBIDDEN_KEYS.has(normalized);
}
