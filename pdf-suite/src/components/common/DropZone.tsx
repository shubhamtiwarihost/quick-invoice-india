import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Image as ImageIcon,
  X,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatFileSize } from '../../lib/pdf-helpers';
import { validatePdfFile, PDF_LIMITS_LABEL } from '../../lib/pdf-validation';

interface DropZoneProps {
  accept: 'pdf' | 'images';
  multiple?: boolean;
  maxSizeMB?: number; // images only (default 100MB); PDFs use PDF_LIMITS
  title?: string;
  subtitle?: string;
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

type PdfCheck = {
  key: string;
  name: string;
  size: number;
  status: 'reading' | 'checking' | 'valid' | 'invalid';
  progress: number;
  pageCount?: number;
  message?: string;
};

// Brief pause so the user sees the "Ready to process" confirmation before the tool takes over.
const READY_HANDOFF_MS = 700;

export const DropZone: React.FC<DropZoneProps> = ({
  accept,
  multiple = false,
  maxSizeMB = 100,
  title,
  subtitle,
  onFilesSelected,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfChecks, setPdfChecks] = useState<PdfCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const isCheckingRef = useRef(false);
  const isMountedRef = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const acceptedMimeTypes =
    accept === 'pdf'
      ? ['application/pdf']
      : ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  const acceptedExtensions = accept === 'pdf' ? ['.pdf'] : ['.jpg', '.jpeg', '.png', '.webp'];

  const validateImageFiles = (filesArray: File[]): File[] => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (const file of filesArray) {
      // Validate MIME type & file extension
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType =
        acceptedMimeTypes.includes(file.type) || acceptedExtensions.includes(ext);

      if (!isValidType) {
        setErrorMessage(
          `Invalid file format for "${file.name}". Only Images (.jpg, .png, .webp) are supported.`
        );
        return [];
      }

      // Validate size
      if (file.size > maxSizeBytes) {
        setErrorMessage(
          `File "${file.name}" is too large (${formatFileSize(file.size)}). Maximum allowed file size is ${maxSizeMB}MB.`
        );
        return [];
      }

      if (file.size === 0) {
        setErrorMessage(`File "${file.name}" is empty (0 bytes).`);
        return [];
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const updateCheck = (key: string, patch: Partial<PdfCheck>) => {
    if (!isMountedRef.current) return;
    setPdfChecks((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  };

  // Validates PDFs locally (signature, size, parse, pages, encryption), then hands valid ones to the tool.
  const processPdfFiles = async (filesArray: File[]) => {
    const batchId = Date.now().toString(36);
    const checks: PdfCheck[] = filesArray.map((file, i) => ({
      key: `${batchId}-${i}`,
      name: file.name,
      size: file.size,
      status: 'reading',
      progress: 0,
    }));

    isCheckingRef.current = true;
    setIsChecking(true);
    setPdfChecks(checks);

    const validFiles: File[] = [];
    for (let i = 0; i < filesArray.length; i++) {
      const { key } = checks[i];
      const result = await validatePdfFile(filesArray[i], (percent) =>
        updateCheck(key, { progress: percent, status: percent < 100 ? 'reading' : 'checking' })
      );
      if (result.ok) {
        validFiles.push(result.file);
        updateCheck(key, { status: 'valid', progress: 100, pageCount: result.pageCount });
      } else {
        updateCheck(key, { status: 'invalid', progress: 100, message: result.message });
      }
    }

    if (validFiles.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, READY_HANDOFF_MS));
    }

    isCheckingRef.current = false;
    if (!isMountedRef.current) return;
    setIsChecking(false);

    if (validFiles.length > 0) {
      // Keep only rejections on screen; accepted files now belong to the tool.
      setPdfChecks((prev) => prev.filter((c) => c.status === 'invalid'));
      onFilesSelected(validFiles);
    }
  };

  const handleIncomingFiles = (fileList: FileList) => {
    if (isCheckingRef.current) return;
    setErrorMessage(null);

    const filesArray = Array.from(fileList);
    if (!multiple && filesArray.length > 1) {
      setErrorMessage('Please select only a single file for this tool.');
      return;
    }

    if (accept === 'pdf') {
      void processPdfFiles(filesArray);
      return;
    }

    const validFiles = validateImageFiles(filesArray);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFiles(e.target.files);
      // Reset input value so the same file can be re-selected if removed
      e.target.value = '';
    }
  };

  const doneChecks = pdfChecks.filter((c) => c.status === 'valid' || c.status === 'invalid');
  const validCount = pdfChecks.filter((c) => c.status === 'valid').length;
  const allDone = pdfChecks.length > 0 && doneChecks.length === pdfChecks.length;

  return (
    <div className={`w-full ${className}`}>
      {errorMessage && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between gap-3 text-rose-800 text-sm animate-in fade-in duration-150">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {accept === 'pdf' && pdfChecks.length > 0 && (
        <div
          className="mb-4 rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {isChecking && !allDone
                ? `Checking PDF${pdfChecks.length > 1 ? 's' : ''}…`
                : 'PDF check'}
            </span>
            {!isChecking && (
              <button
                onClick={() => setPdfChecks([])}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                aria-label="Dismiss PDF check results"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <ul className="divide-y divide-slate-100">
            {pdfChecks.map((check) => (
              <li key={check.key} className="px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  {check.status === 'valid' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : check.status === 'invalid' ? (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-indigo-600 shrink-0 animate-spin" />
                  )}
                  <span className="text-sm font-semibold text-slate-800 truncate" title={check.name}>
                    {check.name}
                  </span>
                </div>

                {check.status === 'reading' && (
                  <div className="mt-2 pl-6">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Reading file on your device…</span>
                      <span className="tabular-nums">{check.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-[width] duration-150"
                        style={{ width: `${check.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {check.status === 'checking' && (
                  <p className="mt-1.5 pl-6 text-xs text-slate-500">
                    Checking PDF structure, pages and password protection…
                  </p>
                )}

                {check.status === 'valid' && (
                  <ul className="mt-1.5 pl-6 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-emerald-700">
                    <li>✓ Valid PDF</li>
                    <li>✓ {formatFileSize(check.size)}</li>
                    <li>
                      ✓ {check.pageCount} {check.pageCount === 1 ? 'page' : 'pages'}
                    </li>
                  </ul>
                )}

                {check.status === 'invalid' && (
                  <p className="mt-1.5 pl-6 text-xs font-medium text-rose-700">{check.message}</p>
                )}
              </li>
            ))}
          </ul>

          {allDone && (
            <div
              className={`px-4 py-2.5 border-t text-sm font-semibold ${
                validCount > 0
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  : 'bg-rose-50 border-rose-100 text-rose-800'
              }`}
            >
              {validCount === 0
                ? pdfChecks.length > 1
                  ? 'None of these files can be processed.'
                  : 'This file cannot be processed.'
                : validCount === pdfChecks.length
                  ? 'Ready to process'
                  : `Ready to process ${validCount} of ${pdfChecks.length} files — the others were skipped.`}
            </div>
          )}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isCheckingRef.current) fileInputRef.current?.click();
        }}
        aria-busy={isChecking}
        className={`relative group border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 ${
          isChecking ? 'cursor-wait opacity-60' : 'cursor-pointer'
        } ${
          isDragOver
            ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01] shadow-lg shadow-indigo-100'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/60 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept === 'pdf' ? '.pdf,application/pdf' : acceptedExtensions.join(',')}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
              isDragOver
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
            }`}
          >
            {accept === 'pdf' ? (
              multiple ? (
                <UploadCloud className="w-8 h-8" />
              ) : (
                <FileText className="w-8 h-8" />
              )
            ) : (
              <ImageIcon className="w-8 h-8" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            {title ||
              (multiple
                ? `Choose ${accept === 'pdf' ? 'PDF files' : 'images'} or drag & drop here`
                : `Choose a ${accept === 'pdf' ? 'PDF file' : 'image'} or drag & drop here`)}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4">
            {subtitle ||
              (accept === 'pdf'
                ? 'Supported format: .pdf'
                : `Supported formats: JPG, PNG, WebP (Up to ${maxSizeMB}MB)`)}
          </p>

          {accept === 'pdf' && (
            <p className="mb-4 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{PDF_LIMITS_LABEL} · Files stay in your browser</span>
            </p>
          )}

          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs shadow-indigo-200 group-hover:shadow-md transition-all cursor-pointer pointer-events-none"
          >
            {isChecking ? 'Checking…' : 'Browse Files'}
          </button>
        </div>
      </div>
    </div>
  );
};
