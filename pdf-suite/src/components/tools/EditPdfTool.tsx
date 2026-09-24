import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import {
  Edit3,
  Type,
  PenTool,
  Square,
  Image as ImageIcon,
  Download,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Plus,
  Move,
  X,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { renderAllPageThumbnails, exportEditedPdf, formatFileSize } from '../../lib/pdf-helpers';
import { validatePdfFile } from '../../lib/pdf-validation';
import { downloadFile } from '../../lib/zip-helpers';
import { trackToolStart, trackToolSuccess, trackToolError } from '../../utils/tracker';
import type { PageThumbnailInfo, PdfAnnotation, ProcessingStatus } from '../../types';

type ActiveToolMode = 'select' | 'text' | 'draw' | 'shape' | 'image';

export const EditPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnailInfo[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0); // 0-based

  // Annotation state
  const [annotations, setAnnotations] = useState<PdfAnnotation[]>([]);
  const [activeMode, setActiveMode] = useState<ActiveToolMode>('text');

  // Tool settings
  const [textColor, setTextColor] = useState<string>('#000000');
  const [fontSize, setFontSize] = useState<number>(18);
  const [penColor, setPenColor] = useState<string>('#dc2626');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [shapeType, setShapeType] = useState<'highlight' | 'whiteout'>('highlight');

  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentDrawPoints, setCurrentDrawPoints] = useState<{ x: number; y: number }[]>([]);

  // Dragging text/image annotation state
  const [draggingAnnId, setDraggingAnnId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas element ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageDimensionsMap = useRef<Map<number, { width: number; height: number }>>(new Map());

  // Processing status
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    title: '',
  });

  const handleFileSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const selected = selectedFiles[0];

    const res = await validatePdfFile(selected);
    if (!res.ok) {
      alert(res.message);
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      setFile(selected);
      setArrayBuffer(buffer);
      setAnnotations([]);
      setCurrentPageIndex(0);

      setProcessingStatus({
        isProcessing: true,
        title: 'Rendering PDF Pages for Editing',
        message: 'Generating high-resolution page view...',
      });

      const thumbs = await renderAllPageThumbnails(buffer);
      setThumbnails(thumbs);
      thumbs.forEach((t, idx) => {
        pageDimensionsMap.current.set(idx, { width: t.width, height: t.height });
      });
      setProcessingStatus({ isProcessing: false, title: '' });
      trackToolStart('edit');
    } catch (err) {
      console.error('Failed to load PDF for editing:', err);
      setProcessingStatus({ isProcessing: false, title: '' });
      trackToolError('edit', { errorMessage: 'Render pages failed' });
      alert('Could not render PDF pages for editing.');
    }
  };

  // Draw current page & annotations on canvas
  useEffect(() => {
    if (!thumbnails[currentPageIndex] || !canvasRef.current) return;
    const currentThumb = thumbnails[currentPageIndex];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = currentThumb.width;
      canvas.height = currentThumb.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Render page annotations
      const currentAnnots = annotations.filter((a) => a.pageIndex === currentPageIndex);

      for (const ann of currentAnnots) {
        if (ann.type === 'drawing' && ann.points.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = ann.colorHex;
          ctx.lineWidth = ann.thickness;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(ann.points[0].x, ann.points[0].y);
          for (let i = 1; i < ann.points.length; i++) {
            ctx.lineTo(ann.points[i].x, ann.points[i].y);
          }
          ctx.stroke();
        } else if (ann.type === 'shape') {
          ctx.save();
          if (ann.fillOpacity < 1) {
            ctx.globalAlpha = ann.fillOpacity;
          }
          ctx.fillStyle = ann.colorHex;
          ctx.fillRect(ann.x, ann.y, ann.width, ann.height);
          ctx.restore();
        } else if (ann.type === 'image') {
          const annImg = new Image();
          annImg.onload = () => {
            ctx.drawImage(annImg, ann.x, ann.y, ann.width, ann.height);
          };
          annImg.src = ann.dataUrl;
        }
      }

      // Render current in-progress stroke if drawing
      if (isDrawing && currentDrawPoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(currentDrawPoints[0].x, currentDrawPoints[0].y);
        for (let i = 1; i < currentDrawPoints.length; i++) {
          ctx.lineTo(currentDrawPoints[i].x, currentDrawPoints[i].y);
        }
        ctx.stroke();
      }
    };
    img.src = currentThumb.dataUrl;
  }, [thumbnails, currentPageIndex, annotations, isDrawing, currentDrawPoints, penColor, penWidth]);

  const getCanvasCoordinates = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);

    if (activeMode === 'text') {
      const defaultText = prompt('Enter text to add to PDF:', 'Sample Text');
      if (defaultText && defaultText.trim()) {
        const newTextAnn: PdfAnnotation = {
          id: Date.now().toString(36),
          type: 'text',
          pageIndex: currentPageIndex,
          x: coords.x,
          y: coords.y,
          text: defaultText.trim(),
          fontSize: fontSize,
          colorHex: textColor,
        };
        setAnnotations((prev) => [...prev, newTextAnn]);
      }
    } else if (activeMode === 'draw') {
      setIsDrawing(true);
      setCurrentDrawPoints([coords]);
    } else if (activeMode === 'shape') {
      const isHighlight = shapeType === 'highlight';
      const newShapeAnn: PdfAnnotation = {
        id: Date.now().toString(36),
        type: 'shape',
        pageIndex: currentPageIndex,
        x: coords.x,
        y: coords.y,
        width: 160,
        height: isHighlight ? 24 : 32,
        colorHex: isHighlight ? '#fde047' : '#ffffff',
        fillOpacity: isHighlight ? 0.45 : 1.0,
      };
      setAnnotations((prev) => [...prev, newShapeAnn]);
    }
  };

  const handleCanvasMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (activeMode === 'draw' && isDrawing) {
      const coords = getCanvasCoordinates(e);
      setCurrentDrawPoints((prev) => [...prev, coords]);
    }
  };

  const handleCanvasMouseUp = () => {
    if (activeMode === 'draw' && isDrawing) {
      setIsDrawing(false);
      if (currentDrawPoints.length > 1) {
        const newDrawAnn: PdfAnnotation = {
          id: Date.now().toString(36),
          type: 'drawing',
          pageIndex: currentPageIndex,
          points: currentDrawPoints,
          colorHex: penColor,
          thickness: penWidth,
        };
        setAnnotations((prev) => [...prev, newDrawAnn]);
      }
      setCurrentDrawPoints([]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const imgFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const newImgAnn: PdfAnnotation = {
          id: Date.now().toString(36),
          type: 'image',
          pageIndex: currentPageIndex,
          x: 50,
          y: 50,
          width: 140,
          height: 80,
          dataUrl,
        };
        setAnnotations((prev) => [...prev, newImgAnn]);
      }
    };
    reader.readAsDataURL(imgFile);
    e.target.value = '';
  };

  const handleUndo = () => {
    setAnnotations((prev) => {
      const pageAnnots = prev.filter((a) => a.pageIndex === currentPageIndex);
      if (pageAnnots.length === 0) return prev;
      const lastId = pageAnnots[pageAnnots.length - 1].id;
      return prev.filter((a) => a.id !== lastId);
    });
  };

  const handleClearPage = () => {
    setAnnotations((prev) => prev.filter((a) => a.pageIndex !== currentPageIndex));
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  const handleExport = async () => {
    if (!arrayBuffer || !file) return;

    setProcessingStatus({
      isProcessing: true,
      title: 'Exporting Edited PDF',
      message: 'Burning annotations and text into PDF pages...',
    });

    try {
      const editedBytes = await exportEditedPdf(
        arrayBuffer,
        annotations,
        pageDimensionsMap.current
      );

      const baseName = file.name.replace(/\.pdf$/i, '');
      const exportName = `${baseName}_edited.pdf`;

      downloadFile(editedBytes, exportName);
      trackToolSuccess('edit', { pageCount: thumbnails.length });
      setProcessingStatus({ isProcessing: false, title: '' });
    } catch (err) {
      console.error('Export failed:', err);
      setProcessingStatus({ isProcessing: false, title: '' });
      trackToolError('edit', { errorMessage: 'Export failed' });
      alert('Failed to export edited PDF.');
    }
  };

  const currentPageTextAnnots = annotations.filter(
    (a): a is import('../../types').PdfAnnotationText =>
      a.pageIndex === currentPageIndex && a.type === 'text'
  );

  return (
    <div className="w-full">
      <ProcessingOverlay status={processingStatus} />

      {!file ? (
        <DropZone
          accept="pdf"
          title="Choose a PDF file to edit"
          subtitle="Add text, freehand drawings, signatures, whiteout & highlight boxes"
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="space-y-6">
          {/* PDF Check Verification Banner */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                PDF CHECK:
              </span>
              <span>✓ Valid PDF</span>
              <span className="text-emerald-300">•</span>
              <span>{formatFileSize(file.size)}</span>
              <span className="text-emerald-300">•</span>
              <span>{thumbnails.length} pages</span>
              <span className="text-emerald-300">•</span>
              <span className="font-semibold text-indigo-700">
                {annotations.length} edits added
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md">
              Ready to edit · Files stay in browser
            </span>
          </div>

          {/* Editor Action Toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            {/* Row 1: Mode Switches */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveMode('text')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMode === 'text'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>Add Text</span>
                </button>

                <button
                  onClick={() => setActiveMode('draw')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMode === 'draw'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Freehand Pen</span>
                </button>

                <button
                  onClick={() => setActiveMode('shape')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMode === 'shape'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Square className="w-4 h-4" />
                  <span>Highlight / Box</span>
                </button>

                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>Add Signature / Image</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Undo & Clear */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                  title="Undo last annotation on current page"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>

                <button
                  onClick={handleClearPage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold cursor-pointer"
                  title="Clear all annotations on current page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Page</span>
                </button>
              </div>
            </div>

            {/* Row 2: Tool Specific Settings */}
            {activeMode === 'text' && (
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="font-semibold text-slate-600">Text Settings:</span>
                <div className="flex items-center gap-2">
                  <span>Color:</span>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>Size:</span>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value={12}>12 px</option>
                    <option value={16}>16 px</option>
                    <option value={18}>18 px</option>
                    <option value={24}>24 px</option>
                    <option value={32}>32 px</option>
                  </select>
                </div>
                <span className="text-slate-400">
                  💡 Click anywhere on the PDF page to type text.
                </span>
              </div>
            )}

            {activeMode === 'draw' && (
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="font-semibold text-slate-600">Pen Settings:</span>
                <div className="flex items-center gap-2">
                  <span>Stroke Color:</span>
                  <input
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>Width:</span>
                  <select
                    value={penWidth}
                    onChange={(e) => setPenWidth(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value={2}>Fine (2px)</option>
                    <option value={4}>Medium (4px)</option>
                    <option value={8}>Thick (8px)</option>
                  </select>
                </div>
                <span className="text-slate-400">
                  💡 Click and drag mouse over page to draw.
                </span>
              </div>
            )}

            {activeMode === 'shape' && (
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="font-semibold text-slate-600">Box Style:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShapeType('highlight')}
                    className={`px-3 py-1 rounded-lg font-semibold cursor-pointer ${
                      shapeType === 'highlight'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Yellow Highlight
                  </button>
                  <button
                    onClick={() => setShapeType('whiteout')}
                    className={`px-3 py-1 rounded-lg font-semibold cursor-pointer ${
                      shapeType === 'whiteout'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Whiteout Box
                  </button>
                </div>
                <span className="text-slate-400">
                  💡 Click on page to place a box annotation.
                </span>
              </div>
            )}
          </div>

          {/* Main Visual PDF Workspace Area */}
          <div className="flex flex-col items-center">
            {/* Page Navigation Header */}
            <div className="w-full flex items-center justify-between mb-3 text-xs font-bold text-slate-700 bg-slate-100 p-3 rounded-xl">
              <button
                disabled={currentPageIndex === 0}
                onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                Page {currentPageIndex + 1} of {thumbnails.length}
              </span>

              <button
                disabled={currentPageIndex === thumbnails.length - 1}
                onClick={() =>
                  setCurrentPageIndex((prev) => Math.min(thumbnails.length - 1, prev + 1))
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Page Canvas Container */}
            <div
              ref={containerRef}
              className="relative bg-slate-200 p-4 rounded-2xl border border-slate-300 shadow-inner flex justify-center max-w-full overflow-auto"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                className={`bg-white shadow-xl rounded-lg ${
                  activeMode === 'draw' ? 'cursor-crosshair' : 'cursor-pointer'
                }`}
              />
            </div>
          </div>

          {/* List of Edits on Current Page */}
          {currentPageTextAnnots.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Text Annotations on Page {currentPageIndex + 1}
              </h4>
              <div className="space-y-2">
                {currentPageTextAnnots.map((ann) => (
                  <div
                    key={ann.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: ann.colorHex }}
                      />
                      <span className="font-semibold text-slate-900">{ann.text}</span>
                      <span className="text-[10px] text-slate-400">({ann.fontSize}px)</span>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnotation(ann.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                      title="Remove text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Action Bar */}
          <div className="p-5 rounded-2xl bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Ready to Download Edited PDF?</span>
              </h3>
              <p className="text-xs text-indigo-200 mt-1">
                Burns all text, drawings, and shapes directly into your PDF pages in browser memory.
              </p>
            </div>

            <button
              onClick={handleExport}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export &amp; Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
