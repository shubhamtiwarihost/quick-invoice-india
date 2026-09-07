import React, { useState } from 'react';
import {
  Scissors,
  CheckSquare,
  Square,
  FileDown,
  Archive,
  RefreshCw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import {
  renderAllPageThumbnails,
  extractPdfPages,
  parsePageRangeString,
  formatPageRangeString,
  formatFileSize,
} from '../../lib/pdf-helpers';
import { downloadFile, downloadAsZip } from '../../lib/zip-helpers';
import { trackToolStart, trackToolSuccess, trackToolError } from '../../utils/tracker';
import type { PageThumbnailInfo, ProcessingStatus } from '../../types';

export const SplitPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnailInfo[]>([]);
  const [rangeInput, setRangeInput] = useState<string>('');
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
      message: 'Generating high-resolution previews for visual page selection...',
      progress: 5,
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

      // Default: all pages selected
      setThumbnails(thumbs);
      const allPages = thumbs.map((t) => t.pageNumber);
      setRangeInput(formatPageRangeString(allPages));
    } catch (err) {
      console.error(err);
      alert('Could not render this PDF. The file may be password-protected or corrupted.');
      setFile(null);
      setArrayBuffer(null);
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    const updated = thumbnails.map((t) =>
      t.pageNumber === pageNumber ? { ...t, selected: !t.selected } : t
    );
    setThumbnails(updated);

    const selectedPages = updated.filter((t) => t.selected).map((t) => t.pageNumber);
    setRangeInput(formatPageRangeString(selectedPages));
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRangeInput(value);

    const parsedPages = parsePageRangeString(value, thumbnails.length);
    const parsedSet = new Set(parsedPages);

    setThumbnails((prev) =>
      prev.map((t) => ({
        ...t,
        selected: parsedSet.has(t.pageNumber),
      }))
    );
  };

  const selectAll = () => {
    setThumbnails((prev) => prev.map((t) => ({ ...t, selected: true })));
    setRangeInput(formatPageRangeString(thumbnails.map((t) => t.pageNumber)));
  };

  const deselectAll = () => {
    setThumbnails((prev) => prev.map((t) => ({ ...t, selected: false })));
    setRangeInput('');
  };

  const selectOddPages = () => {
    const updated = thumbnails.map((t) => ({
      ...t,
      selected: t.pageNumber % 2 !== 0,
    }));
    setThumbnails(updated);
    setRangeInput(formatPageRangeString(updated.filter((t) => t.selected).map((t) => t.pageNumber)));
  };

  const selectEvenPages = () => {
    const updated = thumbnails.map((t) => ({
      ...t,
      selected: t.pageNumber % 2 === 0,
    }));
    setThumbnails(updated);
    setRangeInput(formatPageRangeString(updated.filter((t) => t.selected).map((t) => t.pageNumber)));
  };

  const selectedCount = thumbnails.filter((t) => t.selected).length;

  const handleDownloadCombined = async () => {
    if (!arrayBuffer || !file || selectedCount === 0) {
      alert('Please select at least one page to extract.');
      return;
    }

    const startTime = trackToolStart('split_pdf');

    setProcessingStatus({
      isProcessing: true,
      title: 'Extracting selected pages',
      message: `Creating new PDF with ${selectedCount} selected pages...`,
    });

    try {
      const selectedPages = thumbnails.filter((t) => t.selected).map((t) => t.pageNumber);
      const extractedBytes = await extractPdfPages(arrayBuffer, selectedPages);

      const baseName = file.name.replace(/\.pdf$/i, '');
      const filename = `${baseName}_extracted_pages_${formatPageRangeString(selectedPages).replace(/[\s,]+/g, '_')}.pdf`;
      downloadFile(extractedBytes, filename);

      trackToolSuccess('split_pdf', {
        startTime,
        pageCount: selectedCount,
        fileCount: 1,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Extract failed';
      trackToolError('split_pdf', { startTime, errorMessage: msg });
      alert('Failed to extract pages from PDF.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const handleDownloadZip = async () => {
    if (!arrayBuffer || !file || selectedCount === 0) {
      alert('Please select at least one page to extract.');
      return;
    }

    const startTime = trackToolStart('split_pdf_zip');

    setProcessingStatus({
      isProcessing: true,
      title: 'Packaging pages into ZIP archive',
      message: `Extracting ${selectedCount} individual PDF pages...`,
      progress: 10,
    });

    try {
      const selectedPages = thumbnails.filter((t) => t.selected).map((t) => t.pageNumber);
      const fileEntries: { name: string; content: Uint8Array }[] = [];
      const baseName = file.name.replace(/\.pdf$/i, '');

      for (let i = 0; i < selectedPages.length; i++) {
        const pageNum = selectedPages[i];
        const singlePageBytes = await extractPdfPages(arrayBuffer, [pageNum]);
        fileEntries.push({
          name: `${baseName}_page_${pageNum}.pdf`,
          content: singlePageBytes,
        });

        setProcessingStatus((prev) => ({
          ...prev,
          progress: Math.round(10 + (i / selectedPages.length) * 70),
          message: `Extracted page ${pageNum} (${i + 1} of ${selectedPages.length})...`,
        }));
      }

      setProcessingStatus((prev) => ({
        ...prev,
        title: 'Building ZIP Archive',
        message: 'Compressing PDF pages in memory...',
        progress: 85,
      }));

      await downloadAsZip(fileEntries, `${baseName}_pages_archive.zip`, (pct) => {
        setProcessingStatus((prev) => ({
          ...prev,
          progress: Math.round(85 + (pct / 100) * 15),
        }));
      });

      trackToolSuccess('split_pdf_zip', {
        startTime,
        pageCount: selectedCount,
        fileCount: selectedPages.length,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'ZIP packaging failed';
      trackToolError('split_pdf_zip', { startTime, errorMessage: msg });
      alert('Failed to generate ZIP archive of extracted pages.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const resetAll = () => {
    setFile(null);
    setArrayBuffer(null);
    setThumbnails([]);
    setRangeInput('');
  };

  return (
    <div className="w-full space-y-6">
      <ProcessingOverlay status={processingStatus} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Scissors className="w-6 h-6 text-indigo-600" />
            Split &amp; Extract PDF Pages
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Click pages to select or type a custom range (e.g. &ldquo;1-3, 5&rdquo;) to extract them into a new document.
          </p>
        </div>

        {file && (
          <button
            onClick={resetAll}
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
          title="Select a PDF to split or extract pages"
          subtitle="All page thumbnails are rendered client-side. Zero server upload."
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Range text input */}
              <div className="flex-1 max-w-md">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Range Selection
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={handleRangeInputChange}
                    placeholder="e.g. 1-3, 5, 8-10"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Type ranges like <code className="bg-slate-100 px-1 rounded">1-4, 6, 8-10</code> or click individual thumbnails below.
                </p>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={selectAll}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" /> Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Square className="w-3.5 h-3.5" /> Deselect All
                </button>
                <button
                  onClick={selectOddPages}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Odd Pages
                </button>
                <button
                  onClick={selectEvenPages}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Even Pages
                </button>
              </div>
            </div>

            {/* Status summary */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-600">
                File: <strong className="text-slate-800">{file.name}</strong> ({formatFileSize(file.size)})
              </span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                {selectedCount} of {thumbnails.length} pages selected
              </span>
            </div>
          </div>

          {/* Visual Thumbnails Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {thumbnails.map((thumb) => (
              <div
                key={thumb.pageNumber}
                onClick={() => togglePageSelection(thumb.pageNumber)}
                className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer select-none ${
                  thumb.selected
                    ? 'border-indigo-600 bg-indigo-50/20 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20 scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-90 bg-white'
                }`}
              >
                {/* Checkbox indicator */}
                <div className="absolute top-2 right-2 z-10">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shadow-xs ${
                      thumb.selected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/90 border border-slate-300 text-transparent group-hover:border-indigo-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-xs">
                  Page {thumb.pageNumber}
                </div>

                {/* Thumbnail Preview Image */}
                <div className="p-3 pt-9 flex items-center justify-center min-h-[160px] bg-slate-50">
                  <img
                    src={thumb.dataUrl}
                    alt={`Page ${thumb.pageNumber}`}
                    className="max-h-[180px] w-auto object-contain rounded shadow-xs border border-slate-200/80"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Download Buttons */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Choose to merge the selected pages into 1 PDF or export each as separate PDFs in a ZIP.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadCombined}
                disabled={selectedCount === 0}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                Extract as Single PDF ({selectedCount})
              </button>

              <button
                onClick={handleDownloadZip}
                disabled={selectedCount === 0}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-900 text-white shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Archive className="w-4 h-4" />
                Download as ZIP ({selectedCount} Files)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
