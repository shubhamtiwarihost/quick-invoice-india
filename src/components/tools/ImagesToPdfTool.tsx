import React, { useState } from 'react';
import {
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
  Settings2,
  Download,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { loadImageFile, convertImagesToPdf } from '../../lib/image-helpers';
import { formatFileSize } from '../../lib/pdf-helpers';
import { downloadFile } from '../../lib/zip-helpers';
import { trackToolStart, trackToolSuccess, trackToolError } from '../../utils/tracker';
import type { ImageFileItem, ImageToPdfOptions, ProcessingStatus } from '../../types';

export const ImagesToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageFileItem[]>([]);
  const [options, setOptions] = useState<ImageToPdfOptions>({
    orientation: 'auto',
    pageSize: 'a4',
    margin: 'none',
  });
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    title: '',
  });

  const handleImagesSelected = async (files: File[]) => {
    setProcessingStatus({
      isProcessing: true,
      title: 'Decoding images',
      message: 'Processing image pixels and dimensions in browser memory...',
      progress: 10,
    });

    try {
      const loadedItems: ImageFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = await loadImageFile(files[i]);
        loadedItems.push(item);
        setProcessingStatus((prev) => ({
          ...prev,
          progress: Math.round(10 + (i / files.length) * 85),
          message: `Decoded ${files[i].name} (${i + 1} of ${files.length})...`,
        }));
      }
      setImages((prev) => [...prev, ...loadedItems]);
    } catch (err) {
      console.error(err);
      alert('Failed to read one or more images.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setImages(updated);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    const startTime = trackToolStart('images_to_pdf');

    setProcessingStatus({
      isProcessing: true,
      title: 'Generating PDF document',
      message: `Compiling ${images.length} images with jsPDF engine...`,
      progress: 10,
    });

    try {
      const pdfBlob = await convertImagesToPdf(images, options, (current, total) => {
        setProcessingStatus((prev) => ({
          ...prev,
          progress: Math.round(10 + (current / total) * 85),
          message: `Rendering image ${current} of ${total} onto PDF page...`,
        }));
      });

      const outputName = `images_converted_${Date.now()}.pdf`;
      downloadFile(pdfBlob, outputName);

      trackToolSuccess('images_to_pdf', {
        startTime,
        pageCount: images.length,
        fileCount: images.length,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Image to PDF conversion failed';
      trackToolError('images_to_pdf', { startTime, errorMessage: msg });
      alert('Failed to generate PDF from images.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  return (
    <div className="w-full space-y-6">
      <ProcessingOverlay status={processingStatus} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-600" />
            Images to PDF Converter
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transform JPG, PNG, and WebP images into clean, formatted PDF documents with customizable page orientation and margins.
          </p>
        </div>

        {images.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={handleConvert}
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Convert to PDF ({images.length})
            </button>
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <DropZone
          accept="images"
          multiple={true}
          title="Select or drag JPG, PNG, or WebP images"
          subtitle="Supports multiple image selection and instant drag-and-drop reordering."
          onFilesSelected={handleImagesSelected}
        />
      ) : (
        <div className="space-y-6">
          {/* Options & Settings Panel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
              <Settings2 className="w-4 h-4 text-indigo-600" />
              <span>Document Page Setup</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Orientation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Orientation
                </label>
                <select
                  value={options.orientation}
                  onChange={(e) =>
                    setOptions({ ...options, orientation: e.target.value as any })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer bg-white"
                >
                  <option value="auto">Auto (Smart Match per Image)</option>
                  <option value="portrait">Portrait (Vertical)</option>
                  <option value="landscape">Landscape (Horizontal)</option>
                </select>
              </div>

              {/* Page Format */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Size
                </label>
                <select
                  value={options.pageSize}
                  onChange={(e) =>
                    setOptions({ ...options, pageSize: e.target.value as any })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer bg-white"
                >
                  <option value="a4">A4 (Standard 210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Image Dimensions</option>
                </select>
              </div>

              {/* Margins */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Margin
                </label>
                <select
                  value={options.margin}
                  onChange={(e) =>
                    setOptions({ ...options, margin: e.target.value as any })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer bg-white"
                >
                  <option value="none">No Margin (Full Bleed)</option>
                  <option value="small">Small (5 mm)</option>
                  <option value="normal">Normal (12 mm)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 bg-white shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Header */}
                <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[110px]">
                    {img.width}×{img.height}
                  </span>
                </div>

                {/* Thumbnail Preview */}
                <div className="p-2 flex items-center justify-center min-h-[140px] bg-slate-50/50">
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    className="max-h-[130px] w-auto object-contain rounded shadow-xs"
                  />
                </div>

                {/* Meta details */}
                <div className="p-2 bg-white border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={img.name}>
                    {img.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatFileSize(img.size)}
                  </p>
                </div>

                {/* Move & Delete controls */}
                <div className="p-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Move Left / Earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                    </button>
                    <button
                      onClick={() => moveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Move Right / Later"
                    >
                      <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add more images */}
          <div className="pt-2">
            <DropZone
              accept="images"
              multiple={true}
              title="Add more images"
              subtitle="Upload additional images to append to this PDF document"
              onFilesSelected={handleImagesSelected}
              className="py-6"
            />
          </div>

          {/* Bottom Export Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Total {images.length} images ready to be compiled into a single PDF document.
            </div>
            <button
              onClick={handleConvert}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Generated PDF ({images.length} Pages)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
