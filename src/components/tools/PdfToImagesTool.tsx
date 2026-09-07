import React, { useState } from 'react';
import {
  Images,
  Download,
  Archive,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileDown,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { renderPdfToImages } from '../../lib/image-helpers';
import { formatFileSize } from '../../lib/pdf-helpers';
import { downloadFile, downloadAsZip } from '../../lib/zip-helpers';
import { trackToolStart, trackToolSuccess, trackToolError } from '../../utils/tracker';
import type { ProcessingStatus } from '../../types';

interface RenderedImageItem {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
}

export const PdfToImagesTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [scale, setScale] = useState<number>(2.0); // 2x default for ultra sharp quality
  const [renderedImages, setRenderedImages] = useState<RenderedImageItem[]>([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    title: '',
  });

  const handleFileSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const selected = selectedFiles[0];
    setFile(selected);

    const startTime = trackToolStart('pdf_to_images');

    setProcessingStatus({
      isProcessing: true,
      title: 'Rasterizing PDF pages',
      message: 'Rendering high-resolution raster canvases from PDF vectors...',
      progress: 5,
    });

    try {
      const buffer = await selected.arrayBuffer();
      const images = await renderPdfToImages(buffer, scale, format, (current, total) => {
        setProcessingStatus((prev) => ({
          ...prev,
          progress: Math.round((current / total) * 95),
          message: `Rendered page ${current} of ${total} to ${format.toUpperCase()}...`,
        }));
      });

      setRenderedImages(images);

      trackToolSuccess('pdf_to_images', {
        startTime,
        pageCount: images.length,
        fileCount: 1,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Rasterization failed';
      trackToolError('pdf_to_images', { startTime, errorMessage: msg });
      alert('Failed to render PDF to images. Please check if the file is valid.');
      setFile(null);
      setRenderedImages([]);
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const handleRerender = async (newScale: number, newFormat: 'png' | 'jpeg') => {
    if (!file) return;
    setScale(newScale);
    setFormat(newFormat);

    setProcessingStatus({
      isProcessing: true,
      title: 'Re-rendering pages',
      message: `Re-rasterizing at ${newScale}x scale (${newFormat.toUpperCase()})...`,
      progress: 5,
    });

    try {
      const buffer = await file.arrayBuffer();
      const images = await renderPdfToImages(buffer, newScale, newFormat, (current, total) => {
        setProcessingStatus((prev) => ({
          ...prev,
          progress: Math.round((current / total) * 95),
          message: `Rendering page ${current} of ${total}...`,
        }));
      });

      setRenderedImages(images);
    } catch (err) {
      console.error(err);
      alert('Failed to re-render images.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const downloadSingleImage = (item: RenderedImageItem) => {
    if (!file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    const filename = `${baseName}_page_${item.pageNumber}.${format === 'png' ? 'png' : 'jpg'}`;
    downloadFile(item.blob, filename);
  };

  const downloadAllAsZip = async () => {
    if (!file || renderedImages.length === 0) return;

    const startTime = trackToolStart('pdf_to_images_zip');

    setProcessingStatus({
      isProcessing: true,
      title: 'Creating ZIP archive',
      message: 'Bundling high-res image files into ZIP archive in browser memory...',
      progress: 10,
    });

    try {
      const baseName = file.name.replace(/\.pdf$/i, '');
      const entries = renderedImages.map((img) => ({
        name: `${baseName}_page_${img.pageNumber}.${format === 'png' ? 'png' : 'jpg'}`,
        content: img.blob,
      }));

      await downloadAsZip(entries, `${baseName}_images.zip`, (pct) => {
        setProcessingStatus((prev) => ({
          ...prev,
          progress: pct,
          message: `Compressing ZIP archive (${pct}%)...`,
        }));
      });

      trackToolSuccess('pdf_to_images_zip', {
        startTime,
        pageCount: renderedImages.length,
        fileCount: renderedImages.length,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'ZIP generation failed';
      trackToolError('pdf_to_images_zip', { startTime, errorMessage: msg });
      alert('Failed to create ZIP archive.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const resetTool = () => {
    setFile(null);
    setRenderedImages([]);
  };

  return (
    <div className="w-full space-y-6">
      <ProcessingOverlay status={processingStatus} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Images className="w-6 h-6 text-indigo-600" />
            PDF to Images Converter
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Render every page of your PDF into crisp, high-resolution PNG or JPG images. Download individually or as a single ZIP archive.
          </p>
        </div>

        {file && (
          <button
            onClick={resetTool}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Convert Another PDF
          </button>
        )}
      </div>

      {!file ? (
        <DropZone
          accept="pdf"
          multiple={false}
          title="Select a PDF to convert to images"
          subtitle="Pages are rendered directly to HTML5 canvas elements in your browser."
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="space-y-6">
          {/* Settings & Quality Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Format selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Format:</span>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                  <button
                    onClick={() => handleRerender(scale, 'png')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      format === 'png'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    PNG (Lossless)
                  </button>
                  <button
                    onClick={() => handleRerender(scale, 'jpeg')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      format === 'jpeg'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    JPG (Smaller)
                  </button>
                </div>
              </div>

              {/* Quality / Scale selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quality:</span>
                <select
                  value={scale}
                  onChange={(e) => handleRerender(parseFloat(e.target.value), format)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none cursor-pointer"
                >
                  <option value={1.0}>1x (~72 DPI / Standard Web)</option>
                  <option value={1.5}>1.5x (~108 DPI / Crisp)</option>
                  <option value={2.0}>2x (~144 DPI / Ultra Print Sharp)</option>
                  <option value={3.0}>3x (~216 DPI / Maximum Fidelity)</option>
                </select>
              </div>
            </div>

            {/* ZIP Download All Button */}
            <button
              onClick={downloadAllAsZip}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              Download All as ZIP ({renderedImages.length} Images)
            </button>
          </div>

          {/* Rendered Images Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {renderedImages.map((img) => (
              <div
                key={img.pageNumber}
                className="group rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 bg-white shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Header */}
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Page {img.pageNumber}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatFileSize(img.blob.size)}
                  </span>
                </div>

                {/* Preview Image */}
                <div className="p-3 flex items-center justify-center min-h-[170px] bg-slate-50/50">
                  <img
                    src={img.dataUrl}
                    alt={`Page ${img.pageNumber}`}
                    className="max-h-[150px] w-auto object-contain rounded shadow-xs border border-slate-200"
                  />
                </div>

                {/* Single Download button */}
                <div className="p-2.5 bg-white border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => downloadSingleImage(img)}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Save {format.toUpperCase()}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Export Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All {renderedImages.length} pages rendered in memory at {scale}x resolution ({format.toUpperCase()}).
              </span>
            </div>
            <button
              onClick={downloadAllAsZip}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              Download All as ZIP ({renderedImages.length} Images)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
