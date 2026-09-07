import React, { useState } from 'react';
import {
  Trash2,
  Undo2,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import {
  renderAllPageThumbnails,
  deletePagesFromPdf,
  formatFileSize,
} from '../../lib/pdf-helpers';
import { downloadFile } from '../../lib/zip-helpers';
import { trackToolStart, trackToolSuccess, trackToolError } from '../../utils/tracker';
import type { PageThumbnailInfo, ProcessingStatus } from '../../types';

export const DeletePagesTool: React.FC = () => {
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
      title: 'Rendering page thumbnails',
      message: 'Preparing visual cards for page removal in browser memory...',
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

  const toggleDeletePage = (pageNumber: number) => {
    setThumbnails((prev) =>
      prev.map((t) => (t.pageNumber === pageNumber ? { ...t, deleted: !t.deleted } : t))
    );
  };

  const deleteOddPages = () => {
    setThumbnails((prev) =>
      prev.map((t) => (t.pageNumber % 2 !== 0 ? { ...t, deleted: true } : t))
    );
  };

  const deleteEvenPages = () => {
    setThumbnails((prev) =>
      prev.map((t) => (t.pageNumber % 2 === 0 ? { ...t, deleted: true } : t))
    );
  };

  const restoreAll = () => {
    setThumbnails((prev) => prev.map((t) => ({ ...t, deleted: false })));
  };

  const deletedCount = thumbnails.filter((t) => t.deleted).length;
  const remainingCount = thumbnails.length - deletedCount;

  const handleExportCleaned = async () => {
    if (!arrayBuffer || !file) return;

    if (remainingCount === 0) {
      alert('You cannot delete all pages. Please keep at least one page in the document.');
      return;
    }

    if (deletedCount === 0) {
      const proceed = confirm('No pages have been marked for deletion. Do you want to export anyway?');
      if (!proceed) return;
    }

    const startTime = trackToolStart('delete_pages');

    setProcessingStatus({
      isProcessing: true,
      title: 'Deleting unwanted pages',
      message: `Removing ${deletedCount} pages and rebuilding document stream...`,
    });

    try {
      // 0-indexed page indices to delete
      const indicesToDelete = thumbnails
        .filter((t) => t.deleted)
        .map((t) => t.pageNumber - 1);

      const cleanedBytes = await deletePagesFromPdf(arrayBuffer, indicesToDelete);
      const baseName = file.name.replace(/\.pdf$/i, '');
      downloadFile(cleanedBytes, `${baseName}_cleaned.pdf`);

      trackToolSuccess('delete_pages', {
        startTime,
        pageCount: remainingCount,
        fileCount: 1,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Page deletion failed';
      trackToolError('delete_pages', { startTime, errorMessage: msg });
      alert('Failed to export cleaned PDF.');
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
            <Trash2 className="w-6 h-6 text-indigo-600" />
            Delete PDF Pages
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Click the trash icon on any page to remove it from the document, then export your cleaned PDF.
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
          title="Select a PDF to remove unwanted pages"
          subtitle="All page rendering occurs in memory. Nothing is uploaded to any server."
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="space-y-6">
          {/* Batch Actions & Stats Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">
                Batch Quick Actions:
              </span>
              <button
                onClick={deleteOddPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 transition-colors cursor-pointer"
              >
                Delete Odd Pages
              </button>
              <button
                onClick={deleteEvenPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 transition-colors cursor-pointer"
              >
                Delete Even Pages
              </button>
              <button
                onClick={restoreAll}
                disabled={deletedCount === 0}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
              >
                <Undo2 className="w-3.5 h-3.5" /> Restore All
              </button>
            </div>

            {/* Counts Counter */}
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {remainingCount} Remaining
              </span>
              {deletedCount > 0 && (
                <span className="px-3 py-1 rounded-lg bg-rose-50 text-rose-800 font-bold border border-rose-200 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  {deletedCount} Deleted
                </span>
              )}
            </div>
          </div>

          {remainingCount === 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Warning:</strong> You have marked all pages for deletion. A PDF must contain at least 1 page to export.
              </span>
            </div>
          )}

          {/* Page Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {thumbnails.map((thumb) => (
              <div
                key={thumb.pageNumber}
                className={`group relative rounded-2xl overflow-hidden border transition-all flex flex-col ${
                  thumb.deleted
                    ? 'border-rose-300 bg-rose-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-indigo-300 bg-white shadow-xs hover:shadow-md'
                }`}
              >
                {/* Header info */}
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-bold ${thumb.deleted ? 'line-through text-rose-600' : 'text-slate-700'}`}>
                    Page {thumb.pageNumber}
                  </span>
                  {thumb.deleted && (
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-100 px-1.5 py-0.2 rounded">
                      Removed
                    </span>
                  )}
                </div>

                {/* Thumbnail Preview */}
                <div className="relative p-4 flex items-center justify-center min-h-[190px] bg-slate-50/50">
                  <img
                    src={thumb.dataUrl}
                    alt={`Page ${thumb.pageNumber}`}
                    className={`max-h-[160px] w-auto object-contain rounded shadow-xs transition-opacity ${
                      thumb.deleted ? 'opacity-30 grayscale' : 'opacity-100 border border-slate-200'
                    }`}
                  />

                  {/* Deleted Overlay Watermark */}
                  {thumb.deleted && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-950/20 backdrop-blur-[1px]">
                      <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md mb-2">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-rose-900 bg-white/90 px-2 py-0.5 rounded shadow-xs">
                        Marked for Removal
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Button */}
                <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-center mt-auto">
                  {thumb.deleted ? (
                    <button
                      onClick={() => toggleDeletePage(thumb.pageNumber)}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" /> Restore Page
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleDeletePage(thumb.pageNumber)}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Page
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Export Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Original file: <strong className="text-slate-800">{file.name}</strong> ({thumbnails.length} total pages).
            </div>
            <button
              onClick={handleExportCleaned}
              disabled={remainingCount === 0}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Cleaned PDF ({remainingCount} Pages)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
