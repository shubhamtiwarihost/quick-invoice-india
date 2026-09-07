import React, { useState } from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  FileCheck2,
  Plus,
  RefreshCw,
  Download,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { formatFileSize, getPdfPageCount, mergePdfs } from '../../lib/pdf-helpers';
import { downloadFile } from '../../lib/zip-helpers';
import type { PdfFileItem, ProcessingStatus } from '../../types';

export const MergePdfTool: React.FC = () => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    title: '',
  });

  const handleFilesSelected = async (newFiles: File[]) => {
    setProcessingStatus({
      isProcessing: true,
      title: 'Analyzing uploaded PDFs',
      message: 'Reading page structures and metadata in browser memory...',
    });

    try {
      const parsedItems: PdfFileItem[] = [];

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const buffer = await file.arrayBuffer();
        const pageCount = await getPdfPageCount(buffer);

        parsedItems.push({
          id: Math.random().toString(36).substring(2, 11),
          file,
          name: file.name,
          size: file.size,
          pageCount,
          arrayBuffer: buffer,
        });
      }

      setFiles((prev) => [...prev, ...parsedItems]);
    } catch (err) {
      console.error(err);
      alert('Failed to inspect one of the selected PDF files. Make sure they are not corrupted or password-locked.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  const removeItem = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const totalPages = files.reduce((acc, f) => acc + f.pageCount, 0);
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }

    setProcessingStatus({
      isProcessing: true,
      title: 'Merging PDF documents',
      message: `Combining ${files.length} documents (${totalPages} total pages)...`,
      progress: 10,
    });

    try {
      const buffers = files.map((f) => f.arrayBuffer);
      const mergedBytes = await mergePdfs(buffers, (current, total) => {
        setProcessingStatus((prev) => ({
          ...prev,
          progress: Math.round((current / total) * 90),
          message: `Merging document ${current} of ${total}...`,
        }));
      });

      setProcessingStatus({
        isProcessing: true,
        title: 'Finalizing PDF file',
        message: 'Saving binary stream and preparing download...',
        progress: 98,
      });

      const outputFilename = `merged_${files[0].name.replace(/\.pdf$/i, '')}_and_more.pdf`;
      downloadFile(mergedBytes, outputFilename);
    } catch (err) {
      console.error(err);
      alert('An error occurred while merging your PDFs. Please verify the files are valid.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  return (
    <div className="w-full space-y-6">
      <ProcessingOverlay status={processingStatus} />

      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Merge PDF Files
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Combine 2 or more PDF documents into a single organized file. Reorder pages and files seamlessly.
          </p>
        </div>

        {files.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear List
            </button>
            <button
              onClick={handleMerge}
              disabled={files.length < 2}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                files.length >= 2
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              Merge &amp; Download ({files.length})
            </button>
          </div>
        )}
      </div>

      {files.length === 0 ? (
        <DropZone
          accept="pdf"
          multiple={true}
          title="Select 2 or more PDF files to merge"
          subtitle="Drag & drop your PDFs here or click to browse. Files stay 100% inside your browser."
          onFilesSelected={handleFilesSelected}
        />
      ) : (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-indigo-950">
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                {files.length} {files.length === 1 ? 'file' : 'files'} selected
              </span>
              <span className="text-indigo-400">•</span>
              <span>{totalPages} total pages</span>
              <span className="text-indigo-400">•</span>
              <span>{formatFileSize(totalSize)}</span>
            </div>
            <span className="text-xs text-indigo-600 font-medium">
              Drag or use arrows to rearrange the merge sequence
            </span>
          </div>

          {/* Reorderable File List */}
          <div className="space-y-2.5">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="group p-3 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.pageCount} pages</span>
                      <span>•</span>
                      <span>{formatFileSize(item.size)}</span>
                    </p>
                  </div>
                </div>

                {/* Reorder and Delete Controls */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Move file up in merge order"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Move file down in merge order"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
                    title="Remove from list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add more files dropzone */}
          <div className="pt-2">
            <DropZone
              accept="pdf"
              multiple={true}
              title="Add more PDF files"
              subtitle="Drop more PDFs to append them to the merge queue"
              onFilesSelected={handleFilesSelected}
              className="border-dashed py-6"
            />
          </div>

          {/* Action Footer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              Output will be combined into a single continuous PDF document in the sequence shown above.
            </p>
            <button
              onClick={handleMerge}
              disabled={files.length < 2}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                files.length >= 2
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Download className="w-4 h-4" />
              Merge {files.length} PDFs ({totalPages} Pages)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
