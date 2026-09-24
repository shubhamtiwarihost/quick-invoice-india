import { PDFDocument } from 'pdf-lib';
import { pdfjsLib } from './pdfjs-worker';
import { formatFileSize } from './pdf-helpers';

/**
 * Client-side PDF validation shared by every PDF tool (via DropZone).
 * Everything here runs in the browser — the file is never sent anywhere.
 */

export const PDF_LIMITS = {
  maxBytes: 10 * 1024 * 1024, // 10 MB
  maxPages: 100,
} as const;

export const PDF_LIMITS_LABEL = `Maximum ${PDF_LIMITS.maxBytes / (1024 * 1024)} MB · Maximum ${PDF_LIMITS.maxPages} pages`;

export type PdfRejectReason =
  | 'empty'
  | 'too-large'
  | 'not-pdf'
  | 'unreadable'
  | 'corrupted'
  | 'encrypted'
  | 'too-many-pages';

export type PdfValidationResult =
  | { ok: true; file: File; size: number; pageCount: number }
  | { ok: false; file: File; reason: PdfRejectReason; message: string };

// The PDF spec lets readers accept the "%PDF-" header anywhere in the first
// 1024 bytes (some generators prepend a BOM or junk), so we scan that window.
const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"
const SIGNATURE_WINDOW = 1024;

function hasPdfSignature(bytes: Uint8Array): boolean {
  const end = Math.min(bytes.length, SIGNATURE_WINDOW) - PDF_SIGNATURE.length;
  for (let i = 0; i <= end; i++) {
    let match = true;
    for (let j = 0; j < PDF_SIGNATURE.length; j++) {
      if (bytes[i + j] !== PDF_SIGNATURE[j]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

function readFileWithProgress(file: File, onProgress?: (percent: number) => void): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    reader.onload = () => {
      onProgress?.(100);
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

const reject = (file: File, reason: PdfRejectReason, message: string): PdfValidationResult => ({
  ok: false,
  file,
  reason,
  message,
});

/**
 * Validate a user-selected PDF entirely in the browser.
 * Order: cheap checks first (size), then signature, then full parse.
 */
export async function validatePdfFile(
  file: File,
  onReadProgress?: (percent: number) => void
): Promise<PdfValidationResult> {
  const name = `"${file.name}"`;

  if (file.size === 0) {
    return reject(file, 'empty', `${name} is empty (0 bytes). Please choose a different file.`);
  }

  if (file.size > PDF_LIMITS.maxBytes) {
    return reject(
      file,
      'too-large',
      `${name} is ${formatFileSize(file.size)}. The maximum size is ${formatFileSize(PDF_LIMITS.maxBytes)} per PDF.`
    );
  }

  let buffer: ArrayBuffer;
  try {
    buffer = await readFileWithProgress(file, onReadProgress);
  } catch {
    return reject(file, 'unreadable', `${name} could not be read from your device. Please try selecting it again.`);
  }

  if (!hasPdfSignature(new Uint8Array(buffer, 0, Math.min(buffer.byteLength, SIGNATURE_WINDOW)))) {
    return reject(
      file,
      'not-pdf',
      `${name} is not a real PDF file, even though it may have a .pdf name. Please choose a genuine PDF document.`
    );
  }

  // Parse with pdf.js: detects unreadable structure, user passwords, and gives the true page count.
  // pdf.js transfers its input to the worker, so hand it a copy.
  let pageCount: number;
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
  try {
    const pdf = await loadingTask.promise;
    pageCount = pdf.numPages;
  } catch (err) {
    const errName = (err as { name?: string } | null)?.name;
    if (errName === 'PasswordException') {
      return reject(
        file,
        'encrypted',
        `${name} is password-protected. Please remove the password (open it and save/print a copy without one) and try again.`
      );
    }
    return reject(file, 'corrupted', `${name} appears to be damaged or corrupted and cannot be opened.`);
  } finally {
    loadingTask.destroy();
  }

  if (pageCount < 1) {
    return reject(file, 'corrupted', `${name} has no pages and cannot be processed.`);
  }

  if (pageCount > PDF_LIMITS.maxPages) {
    return reject(
      file,
      'too-many-pages',
      `${name} has ${pageCount} pages. The maximum is ${PDF_LIMITS.maxPages} pages per PDF.`
    );
  }

  // pdf-lib is the editing engine; make sure it can load the file too, and catch
  // owner-password (permissions) encryption that pdf.js opens silently.
  try {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true, updateMetadata: false });
    if (doc.isEncrypted) {
      return reject(
        file,
        'encrypted',
        `${name} is encrypted with a password or editing restrictions. Please remove the protection and try again.`
      );
    }
  } catch {
    return reject(file, 'corrupted', `${name} appears to be damaged or corrupted and cannot be edited.`);
  }

  return { ok: true, file, size: file.size, pageCount };
}
