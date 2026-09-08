import * as pdfjsLib from 'pdfjs-dist';

// Configure the PDF.js worker URL
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  try {
    // Standard URL resolution supported by modern bundlers (Vite) and modern ESM
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';
  }
}

export { pdfjsLib };
