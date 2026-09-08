import React, { useState } from 'react';
import {
  RotateCw,
  RotateCcw,
  RefreshCw,
  Download,
  FlipHorizontal,
  Check,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import {
  renderAllPageThumbnails,
  rotatePdfPages,
  formatFileSize,
} from '../../lib/pdf-helpers';
import { downloadFile } from '../../lib/zip-helpers';
import { trackToolStart, trackToolSuccess, trackToolError } from '../../utils/tracker';
import type { PageThumbnailInfo, ProcessingStatus } from '../../types';

export const RotatePdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnailInfo[]>([]);
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
      title: 'Rendering page previews',
      message: 'Generating interactive cards for each page in browser memory...',
      progress: 10,
    });

    try {
      const buffer = await selected.arrayBuffer();
      setArrayBuffer(buffer);

      const thumbs = await renderAllPageThumbnails(buffer, (current, total) => {
        setProcessingStatus((prev) => ({
          ...prev,
          progress: Math.round((current / total) * 95),
          message: `Rendering thumbnail ${current} of ${total}...`,
        }));
      });

      setThumbnails(thumbs);
    } catch (err) {
      console.error(err);
      alert('Failed to load PDF. Please make sure the file is valid and unencrypted.');
      setFile(null);
      setArrayBuffer(null);
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const rotateSinglePage = (pageNumber: number, deltaAngle: number) => {
    setThumbnails((prev) =>
      prev.map((t) => {
        if (t.pageNumber === pageNumber) {
          const newRot = (t.currentRotation + deltaAngle + 360) % 360;
          return { ...t, currentRotation: newRot };
        }
        return t;
      })
    );
  };

  const resetSinglePage = (pageNumber: number) => {
    setThumbnails((prev) =>
      prev.map((t) => (t.pageNumber === pageNumber ? { ...t, currentRotation: 0 } : t))
    );
  };

  const rotateAll = (deltaAngle: number) => {
    setThumbnails((prev) =>
      prev.map((t) => ({
        ...t,
        currentRotation: (t.currentRotation + deltaAngle + 360) % 360,
      }))
    );
  };

  const resetAllRotations = () => {
    setThumbnails((prev) => prev.map((t) => ({ ...t, currentRotation: 0 })));
  };

  const rotatedCount = thumbnails.filter((t) => t.currentRotation !== 0).length;

  const handleExport = async () => {
    if (!arrayBuffer || !file) return;

    if (rotatedCount === 0) {
      const proceed = confirm('No pages have been rotated. Do you want to export anyway?');
      if (!proceed) return;
    }

    const startTime = trackToolStart('rotate_pdf');

    setProcessingStatus({
      isProcessing: true,
      title: 'Applying page rotations',
      message: 'Encoding orientation vectors directly into the PDF structure...',
    });

    try {
      const rotationMap = new Map<number, number>();
      thumbnails.forEach((t, idx) => {
        if (t.currentRotation !== 0) {
          rotationMap.set(idx, t.currentRotation);
        }
      });

      const rotatedBytes = await rotatePdfPages(arrayBuffer, rotationMap);
      const baseName = file.name.replace(/\.pdf$/i, '');
      downloadFile(rotatedBytes, `${baseName}_rotated.pdf`);

      trackToolSuccess('rotate_pdf', {
        startTime,
        pageCount: thumbnails.length,
        fileCount: 1,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Rotation export failed';
      trackToolError('rotate_pdf', { startTime, errorMessage: msg });
      alert('Failed to export rotated PDF.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const resetTool = () => {
    setFile(null);
    setArrayBuffer(null);
    setThumbnails([]);
  };

  return (
    <div className="w-full space-y-6">
      <ProcessingOverlay status={processingStatus} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <RotateCw className="w-6 h-6 text-indigo-600" />
            Rotate PDF Pages
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rotate individual pages or apply batch rotations across all pages in 90° or 180° increments.
          </p>
        </div>

        {file && (
          <button
            onClick={resetTool}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Choose Different PDF
          </button>
        )}
      </div>

      {!file ? (
        <DropZone
          accept="pdf"
          multiple={false}
          title="Select a PDF to rotate pages"
          subtitle="All page orientations are adjusted client-side in seconds."
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="space-y-6">
          {/* Batch Actions Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">
                Batch Rotate All:
              </span>
              <button
                onClick={() => rotateAll(90)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCw className="w-3.5 h-3.5" /> All +90° CW
              </button>
              <button
                onClick={() => rotateAll(-90)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> All -90° CCW
              </button>
              <button
                onClick={() => rotateAll(180)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <FlipHorizontal className="w-3.5 h-3.5" /> All 180°
              </button>
              <button
                onClick={resetAllRotations}
                disabled={rotatedCount === 0}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Reset All
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600">
                {rotatedCount} of {thumbnails.length} pages altered
              </span>
              <button
                onClick={handleExport}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Rotated PDF
              </button>
            </div>
          </div>

          {/* Interactive Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {thumbnails.map((thumb) => (
              <div
                key={thumb.pageNumber}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 bg-white shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Top Badge Info */}
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Page {thumb.pageNumber}</span>
                  {thumb.currentRotation !== 0 ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-600 text-white shadow-2xs">
                      +{thumb.currentRotation}°
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">0°</span>
                  )}
                </div>

                {/* Animated Canvas / Image Preview Container */}
                <div className="p-4 flex items-center justify-center min-h-[190px] bg-slate-50/50 overflow-hidden">
                  <div
                    className="transition-transform duration-300 ease-in-out flex items-center justify-center"
                    style={{
                      transform: `rotate(${thumb.currentRotation}deg)`,
                    }}
                  >
                    <img
                      src={thumb.dataUrl}
                      alt={`Page ${thumb.pageNumber}`}
                      className="max-h-[160px] w-auto object-contain rounded shadow-xs border border-slate-200"
                    />
                  </div>
                </div>

                {/* Individual Rotation Controls */}
                <div className="p-2 bg-white border-t border-slate-100 flex items-center justify-around gap-1 mt-auto">
                  <button
                    onClick={() => rotateSinglePage(thumb.pageNumber, -90)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Rotate 90° Counter-Clockwise"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => rotateSinglePage(thumb.pageNumber, 90)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => rotateSinglePage(thumb.pageNumber, 180)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Rotate 180°"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                  </button>
                  {thumb.currentRotation !== 0 && (
                    <button
                      onClick={() => resetSinglePage(thumb.pageNumber)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                      title="Reset page rotation"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Export Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Rotations are saved without any image recompression, preserving 100% vector fidelity and original PDF quality.
            </div>
            <button
              onClick={handleExport}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Rotated PDF ({thumbnails.length} Pages)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
