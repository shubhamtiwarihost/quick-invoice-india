import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { formatFileSize } from '../../lib/pdf-helpers';

interface DropZoneProps {
  accept: 'pdf' | 'images';
  multiple?: boolean;
  maxSizeMB?: number; // default 100MB
  title?: string;
  subtitle?: string;
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedMimeTypes =
    accept === 'pdf'
      ? ['application/pdf']
      : ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  const acceptedExtensions = accept === 'pdf' ? ['.pdf'] : ['.jpg', '.jpeg', '.png', '.webp'];

  const validateFiles = (fileList: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    setErrorMessage(null);

    const filesArray = Array.from(fileList);

    if (!multiple && filesArray.length > 1) {
      setErrorMessage('Please select only a single file for this tool.');
      return [];
    }

    for (const file of filesArray) {
      // Validate MIME type & file extension
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType =
        acceptedMimeTypes.includes(file.type) || acceptedExtensions.includes(ext);

      if (!isValidType) {
        setErrorMessage(
          `Invalid file format for "${file.name}". Only ${accept === 'pdf' ? 'PDF documents (.pdf)' : 'Images (.jpg, .png, .webp)'} are supported.`
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
      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      // Reset input value so the same file can be re-selected if removed
      e.target.value = '';
    }
  };

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

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01] shadow-lg shadow-indigo-100'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/60 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedExtensions.join(',')}
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
                ? `Supported format: .pdf (Up to ${maxSizeMB}MB per file)`
                : `Supported formats: JPG, PNG, WebP (Up to ${maxSizeMB}MB)`)}
          </p>

          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs shadow-indigo-200 group-hover:shadow-md transition-all cursor-pointer pointer-events-none"
          >
            Browse Files
          </button>
        </div>
      </div>
    </div>
  );
};
