import { jsPDF } from 'jspdf';
import { pdfjsLib } from './pdfjs-worker';
import type { ImageFileItem, ImageToPdfOptions } from '../types';

/**
 * Load an image File into an ImageFileItem with dimensions and preview dataUrl
 */
export async function loadImageFile(file: File): Promise<ImageFileItem> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          id: Math.random().toString(36).substring(2, 11),
          file,
          name: file.name,
          size: file.size,
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = () => reject(new Error(`Failed to decode image ${file.name}`));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert multiple images into a single PDF using jsPDF
 */
export async function convertImagesToPdf(
  images: ImageFileItem[],
  options: ImageToPdfOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('No images provided for PDF generation');
  }

  // Page dimensions in mm
  const pageFormats = {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
  };

  const marginMm = options.margin === 'none' ? 0 : options.margin === 'small' ? 5 : 12;

  let doc: jsPDF | null = null;

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const isImageLandscape = item.width > item.height;

    let orientation: 'p' | 'l' = 'p';
    if (options.orientation === 'auto') {
      orientation = isImageLandscape ? 'l' : 'p';
    } else {
      orientation = options.orientation === 'landscape' ? 'l' : 'p';
    }

    if (options.pageSize === 'fit') {
      // Create page matching image aspect ratio
      const standardWidthMm = orientation === 'p' ? 210 : 297;
      const calculatedHeightMm = (item.height / item.width) * standardWidthMm;

      if (!doc) {
        doc = new jsPDF({
          orientation,
          unit: 'mm',
          format: [standardWidthMm, calculatedHeightMm],
        });
      } else {
        doc.addPage([standardWidthMm, calculatedHeightMm], orientation);
      }

      // Add image filling the page
      doc.addImage(
        item.dataUrl,
        item.file.type.includes('png') ? 'PNG' : 'JPEG',
        marginMm,
        marginMm,
        standardWidthMm - marginMm * 2,
        calculatedHeightMm - marginMm * 2
      );
    } else {
      const baseFormat = pageFormats[options.pageSize];
      const pageWidth = orientation === 'p' ? baseFormat.width : baseFormat.height;
      const pageHeight = orientation === 'p' ? baseFormat.height : baseFormat.width;

      if (!doc) {
        doc = new jsPDF({
          orientation,
          unit: 'mm',
          format: options.pageSize,
        });
      } else {
        doc.addPage(options.pageSize, orientation);
      }

      const availableWidth = pageWidth - marginMm * 2;
      const availableHeight = pageHeight - marginMm * 2;

      // Fit image while maintaining aspect ratio
      const imgRatio = item.width / item.height;
      const boxRatio = availableWidth / availableHeight;

      let drawWidth = availableWidth;
      let drawHeight = availableHeight;
      let x = marginMm;
      let y = marginMm;

      if (imgRatio > boxRatio) {
        // Image is wider than available box
        drawWidth = availableWidth;
        drawHeight = availableWidth / imgRatio;
        y = marginMm + (availableHeight - drawHeight) / 2;
      } else {
        // Image is taller than available box
        drawHeight = availableHeight;
        drawWidth = availableHeight * imgRatio;
        x = marginMm + (availableWidth - drawWidth) / 2;
      }

      doc.addImage(
        item.dataUrl,
        item.file.type.includes('png') ? 'PNG' : 'JPEG',
        x,
        y,
        drawWidth,
        drawHeight
      );
    }

    if (onProgress) {
      onProgress(i + 1, images.length);
    }
  }

  if (!doc) {
    throw new Error('Failed to create PDF document');
  }

  return doc.output('blob');
}

/**
 * Render all pages of a PDF to high-resolution PNG/JPEG images
 */
export async function renderPdfToImages(
  arrayBuffer: ArrayBuffer,
  scale: number = 2.0, // 2x for sharp print quality
  format: 'png' | 'jpeg' = 'png',
  onProgress?: (current: number, total: number) => void
): Promise<{ pageNumber: number; blob: Blob; dataUrl: string }[]> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const results: { pageNumber: number; blob: Blob; dataUrl: string }[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: format === 'png' });

    if (ctx) {
      if (format === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;
    }

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas toBlob conversion failed'));
        },
        mimeType,
        0.95
      );
    });

    results.push({
      pageNumber: pageNum,
      blob,
      dataUrl,
    });

    if (onProgress) {
      onProgress(pageNum, numPages);
    }
  }

  return results;
}
