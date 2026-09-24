import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import { pdfjsLib } from './pdfjs-worker';
import type { PageThumbnailInfo, WatermarkOptions } from '../types';

/**
 * Format bytes into human readable format (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Parse a page range string like "1-3, 5, 7-10" into an array of 1-based page numbers
 */
export function parsePageRangeString(rangeStr: string, totalPages: number): number[] {
  const result = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          result.add(i);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        result.add(page);
      }
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

/**
 * Convert an array of 1-based page numbers back into a compact range string like "1-3, 5, 7"
 */
export function formatPageRangeString(pages: number[]): string {
  if (pages.length === 0) return '';
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = start;

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = current;
      prev = current;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(', ');
}

/**
 * Get the total number of pages from a PDF ArrayBuffer
 */
export async function getPdfPageCount(arrayBuffer: ArrayBuffer): Promise<number> {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) }).promise;
  return pdf.numPages;
}

/**
 * Render all page thumbnails for a given PDF
 */
export async function renderAllPageThumbnails(
  arrayBuffer: ArrayBuffer,
  onProgress?: (current: number, total: number) => void
): Promise<PageThumbnailInfo[]> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const thumbnails: PageThumbnailInfo[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const originalRotation = page.rotate || 0;

    // Viewport scaled for crisp thumbnail preview
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const targetWidth = 260;
    const scale = targetWidth / unscaledViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      // Render page
      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    thumbnails.push({
      pageNumber: pageNum,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      originalRotation,
      currentRotation: 0,
      selected: true,
      deleted: false,
    });

    if (onProgress) {
      onProgress(pageNum, numPages);
    }
  }

  return thumbnails;
}

/**
 * Merge multiple PDF ArrayBuffers into a single PDF
 */
export async function mergePdfs(
  buffers: ArrayBuffer[],
  onProgress?: (index: number, total: number) => void
): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < buffers.length; i++) {
    const srcBuffer = buffers[i];
    const srcDoc = await PDFDocument.load(srcBuffer, { ignoreEncryption: true });
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);

    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }

    if (onProgress) {
      onProgress(i + 1, buffers.length);
    }
  }

  return await mergedDoc.save();
}

/**
 * Split/extract selected pages from a PDF
 * @param pageNumbers 1-indexed page numbers to extract
 */
export async function extractPdfPages(
  arrayBuffer: ArrayBuffer,
  pageNumbers: number[]
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  // Convert 1-indexed to 0-indexed and sort
  const indices = pageNumbers
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < srcDoc.getPageCount());

  const copiedPages = await newDoc.copyPages(srcDoc, indices);
  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  return await newDoc.save();
}

/**
 * Rotate pages of a PDF
 * @param rotations Map of 0-based page index to rotation degrees (e.g. 90, 180, 270)
 */
export async function rotatePdfPages(
  arrayBuffer: ArrayBuffer,
  rotations: Map<number, number>
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = doc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const additionalRotation = rotations.get(i) || 0;
    if (additionalRotation !== 0) {
      const page = pages[i];
      const currentRotation = page.getRotation().angle;
      const finalAngle = (currentRotation + additionalRotation) % 360;
      page.setRotation(degrees(finalAngle));
    }
  }

  return await doc.save();
}

/**
 * Delete specific pages from a PDF
 * @param pageIndicesToDelete 0-indexed page indices to remove
 */
export async function deletePagesFromPdf(
  arrayBuffer: ArrayBuffer,
  pageIndicesToDelete: number[]
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Important: Sort in descending order to avoid index shifting
  const sortedDesc = [...new Set(pageIndicesToDelete)].sort((a, b) => b - a);

  for (const index of sortedDesc) {
    if (index >= 0 && index < doc.getPageCount()) {
      doc.removePage(index);
    }
  }

  return await doc.save();
}

/**
 * Helper to convert hex color to RGB (0-1 range for pdf-lib)
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;
  return {
    r: isNaN(r) ? 0.8 : r,
    g: isNaN(g) ? 0.2 : g,
    b: isNaN(b) ? 0.2 : b,
  };
}

/**
 * Apply customizable watermark to all pages of a PDF
 */
export async function watermarkPdf(
  arrayBuffer: ArrayBuffer,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();
  const color = hexToRgb(options.colorHex);

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);
    const textHeight = font.heightAtSize(options.fontSize);

    let x = (width - textWidth) / 2;
    let y = (height - textHeight) / 2;

    if (options.position === 'top') {
      y = height - textHeight - 40;
    } else if (options.position === 'bottom') {
      y = 40;
    }

    page.drawText(options.text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity: options.opacity,
      rotate: degrees(options.rotationAngle),
    });
  }

  return await doc.save();
}

/**
 * Protect PDF with user password and optional owner password
 */
export async function protectPdf(
  arrayBuffer: ArrayBuffer,
  userPassword: string,
  ownerPassword?: string
): Promise<Uint8Array> {
  const inputBytes = new Uint8Array(arrayBuffer);
  // Encrypt client-side using RC4 128-bit PDF encryption
  const encryptedBytes = await encryptPDF(
    inputBytes,
    userPassword,
    ownerPassword || userPassword
  );
  return encryptedBytes;
}

/**
 * Export edited PDF with text, drawings, shapes, and images burned into the PDF pages
 */
export async function exportEditedPdf(
  arrayBuffer: ArrayBuffer,
  annotations: import('../types').PdfAnnotation[],
  pageCanvasDimensions: Map<number, { width: number; height: number }>
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const page = pages[pageIdx];
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const canvasDim = pageCanvasDimensions.get(pageIdx) || { width: pageWidth, height: pageHeight };
    const pageAnnotations = annotations.filter((a) => a.pageIndex === pageIdx);

    for (const ann of pageAnnotations) {
      if (ann.type === 'text') {
        const c = hexToRgb(ann.colorHex);
        const scaleX = pageWidth / canvasDim.width;
        const scaleY = pageHeight / canvasDim.height;

        const fontPdfSize = ann.fontSize * scaleY;
        const pdfX = ann.x * scaleX;
        // In PDF coordinates, Y=0 is bottom
        const pdfY = pageHeight - (ann.y * scaleY) - (fontPdfSize * 0.8);

        page.drawText(ann.text, {
          x: Math.max(0, pdfX),
          y: Math.max(0, pdfY),
          size: Math.max(6, fontPdfSize),
          font,
          color: rgb(c.r, c.g, c.b),
        });
      } else if (ann.type === 'shape') {
        const c = hexToRgb(ann.colorHex);
        const scaleX = pageWidth / canvasDim.width;
        const scaleY = pageHeight / canvasDim.height;

        const pdfX = ann.x * scaleX;
        const pdfY = pageHeight - ((ann.y + ann.height) * scaleY);
        const pdfWidth = ann.width * scaleX;
        const pdfHeight = ann.height * scaleY;

        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: pdfWidth,
          height: pdfHeight,
          color: rgb(c.r, c.g, c.b),
          opacity: ann.fillOpacity,
        });
      } else if (ann.type === 'drawing') {
        if (ann.points.length < 2) continue;
        const c = hexToRgb(ann.colorHex);
        const scaleX = pageWidth / canvasDim.width;
        const scaleY = pageHeight / canvasDim.height;
        const thickness = Math.max(1, ann.thickness * scaleX);

        for (let i = 0; i < ann.points.length - 1; i++) {
          const p1 = ann.points[i];
          const p2 = ann.points[i + 1];

          const x1 = p1.x * scaleX;
          const y1 = pageHeight - (p1.y * scaleY);
          const x2 = p2.x * scaleX;
          const y2 = pageHeight - (p2.y * scaleY);

          page.drawLine({
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
            thickness,
            color: rgb(c.r, c.g, c.b),
          });
        }
      } else if (ann.type === 'image') {
        const scaleX = pageWidth / canvasDim.width;
        const scaleY = pageHeight / canvasDim.height;

        const pdfX = ann.x * scaleX;
        const pdfY = pageHeight - ((ann.y + ann.height) * scaleY);
        const pdfWidth = ann.width * scaleX;
        const pdfHeight = ann.height * scaleY;

        try {
          let embeddedImg;
          if (ann.dataUrl.startsWith('data:image/png')) {
            embeddedImg = await doc.embedPng(ann.dataUrl);
          } else {
            embeddedImg = await doc.embedJpg(ann.dataUrl);
          }
          page.drawImage(embeddedImg, {
            x: pdfX,
            y: pdfY,
            width: pdfWidth,
            height: pdfHeight,
          });
        } catch (err) {
          console.error('Failed to embed image in PDF:', err);
        }
      }
    }
  }

  return await doc.save();
}
