import React, { useState, useEffect, useRef } from 'react';
import {
  Stamp,
  Download,
  RefreshCw,
  Sliders,
  Type,
  Palette,
  RotateCw,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { renderAllPageThumbnails, watermarkPdf, formatFileSize } from '../../lib/pdf-helpers';
import { downloadFile } from '../../lib/zip-helpers';
import type { PageThumbnailInfo, WatermarkOptions, ProcessingStatus } from '../../types';

export const WatermarkPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [firstPageThumb, setFirstPageThumb] = useState<PageThumbnailInfo | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [options, setOptions] = useState<WatermarkOptions>({
    text: 'CONFIDENTIAL',
    fontSize: 42,
    colorHex: '#dc2626', // Red
    opacity: 0.35,
    rotationAngle: 45,
    position: 'diagonal',
  });

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    title: '',
  });

  const handleFileSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const selected = selectedFiles[0];
    setFile(selected);

    setProcessingStatus({
      isProcessing: true,
      title: 'Preparing document preview',
      message: 'Rendering preview of the first page in browser memory...',
      progress: 20,
    });

    try {
      const buffer = await selected.arrayBuffer();
      setArrayBuffer(buffer);

      // Render thumbnails
      const thumbs = await renderAllPageThumbnails(buffer);
      setTotalPages(thumbs.length);
      if (thumbs.length > 0) {
        setFirstPageThumb(thumbs[0]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load PDF for watermarking.');
      setFile(null);
      setArrayBuffer(null);
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const handleApplyWatermark = async () => {
    if (!arrayBuffer || !file) return;

    if (!options.text.trim()) {
      alert('Please enter watermark text.');
      return;
    }

    setProcessingStatus({
      isProcessing: true,
      title: 'Applying watermark across all pages',
      message: `Imprinting text onto ${totalPages} pages using pdf-lib...`,
      progress: 30,
    });

    try {
      const watermarkedBytes = await watermarkPdf(arrayBuffer, options);
      const baseName = file.name.replace(/\.pdf$/i, '');
      downloadFile(watermarkedBytes, `${baseName}_watermarked.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to apply watermark to PDF.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const resetTool = () => {
    setFile(null);
    setArrayBuffer(null);
    setFirstPageThumb(null);
  };

  const colorPresets = [
    { label: 'Red', hex: '#dc2626' },
    { label: 'Charcoal', hex: '#475569' },
    { label: 'Blue', hex: '#2563eb' },
    { label: 'Green', hex: '#059669' },
    { label: 'Amber', hex: '#d97706' },
  ];

  const textPresets = ['CONFIDENTIAL', 'DRAFT', 'DO NOT COPY', 'SAMPLE', 'APPROVED'];

  return (
    <div className="w-full space-y-6">
      <ProcessingOverlay status={processingStatus} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Stamp className="w-6 h-6 text-indigo-600" />
            Watermark PDF
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Apply customizable text watermarks across all document pages with live visual preview.
          </p>
        </div>

        {file && (
          <button
            onClick={resetTool}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Watermark Another PDF
          </button>
        )}
      </div>

      {!file ? (
        <DropZone
          accept="pdf"
          multiple={false}
          title="Select a PDF to watermark"
          subtitle="Preview and customize watermark formatting live in your browser."
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Visual Preview */}
          <div className="lg:col-span-6 xl:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-700">Live Preview (Page 1 of {totalPages})</span>
              <span className="text-slate-400 font-mono text-[11px]">{file.name}</span>
            </div>

            {/* Preview Sheet Container */}
            <div className="relative w-full max-w-[340px] aspect-[1/1.414] bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden flex items-center justify-center p-2">
              {firstPageThumb && (
                <img
                  src={firstPageThumb.dataUrl}
                  alt="Page 1 Preview"
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              )}

              {/* Watermark Overlay Element */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                style={{
                  alignItems:
                    options.position === 'top'
                      ? 'flex-start'
                      : options.position === 'bottom'
                      ? 'flex-end'
                      : 'center',
                  padding: options.position === 'top' || options.position === 'bottom' ? '30px' : '0',
                }}
              >
                <span
                  style={{
                    color: options.colorHex,
                    opacity: options.opacity,
                    fontSize: `${options.fontSize * 0.45}px`,
                    transform: `rotate(${options.rotationAngle}deg)`,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    fontFamily: 'sans-serif',
                    whiteSpace: 'nowrap',
                    textShadow: '0 0 1px rgba(0,0,0,0.1)',
                  }}
                >
                  {options.text || 'WATERMARK TEXT'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              Watermark will be applied to all {totalPages} pages using identical formatting.
            </p>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-6 xl:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            {/* Watermark text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-600" />
                Watermark Text
              </label>
              <input
                type="text"
                value={options.text}
                onChange={(e) => setOptions({ ...options, text: e.target.value })}
                placeholder="Enter watermark text..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-semibold"
              />

              {/* Quick Text Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {textPresets.map((txt) => (
                  <button
                    key={txt}
                    type="button"
                    onClick={() => setOptions({ ...options, text: txt })}
                    className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                Color &amp; Tone
              </label>
              <div className="flex items-center gap-2">
                {colorPresets.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setOptions({ ...options, colorHex: c.hex })}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                      options.colorHex.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-indigo-600 scale-110 shadow-xs'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
                <input
                  type="color"
                  value={options.colorHex}
                  onChange={(e) => setOptions({ ...options, colorHex: e.target.value })}
                  className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer overflow-hidden"
                  title="Custom Color"
                />
              </div>
            </div>

            {/* Sliders: Opacity, Size, Rotation */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {/* Opacity */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Opacity</span>
                  <span className="font-mono text-indigo-600">{Math.round(options.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.05"
                  value={options.opacity}
                  onChange={(e) => setOptions({ ...options, opacity: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Font Size */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Font Size</span>
                  <span className="font-mono text-indigo-600">{options.fontSize} pt</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="100"
                  step="2"
                  value={options.fontSize}
                  onChange={(e) => setOptions({ ...options, fontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Rotation Angle */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Rotation Angle</span>
                  <span className="font-mono text-indigo-600">{options.rotationAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="5"
                  value={options.rotationAngle}
                  onChange={(e) => setOptions({ ...options, rotationAngle: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, rotationAngle: 45 })}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    45° Diagonal
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, rotationAngle: 0 })}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    0° Horizontal
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, rotationAngle: -45 })}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    -45° Diagonal
                  </button>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleApplyWatermark}
                className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Apply Watermark &amp; Download PDF ({totalPages} Pages)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
