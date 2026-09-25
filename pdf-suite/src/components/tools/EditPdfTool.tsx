import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import {
  LayoutGrid,
  Hand,
  Undo2,
  Redo2,
  Type,
  Edit3,
  Eraser,
  Highlighter,
  Pencil,
  Image as ImageIcon,
  Circle,
  X,
  Check,
  PenTool,
  MessageSquare,
  Link,
  Wand2,
  Layout,
  Files,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Plus,
  Minus,
  RotateCw,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { renderAllPageThumbnails, exportEditedPdf, formatFileSize } from '../../lib/pdf-helpers';
import { validatePdfFile } from '../../lib/pdf-validation';
import { downloadFile } from '../../lib/zip-helpers';
import { trackToolStart, trackToolSuccess, trackToolError } from '../../utils/tracker';
import type { PageThumbnailInfo, PdfAnnotation, ProcessingStatus } from '../../types';

type ActiveToolMode =
  | 'select'
  | 'move'
  | 'text'
  | 'editText'
  | 'eraser'
  | 'highlight'
  | 'pencil'
  | 'image'
  | 'ellipse'
  | 'cross'
  | 'check'
  | 'sign'
  | 'annotation'
  | 'link'
  | 'more'
  | 'pageLayout'
  | 'manage';

export const EditPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnailInfo[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0); // 0-based

  // UI view toggles
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(200);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // percentage: 50, 75, 100, 125, 150

  // Active Tool state
  const [activeMode, setActiveMode] = useState<ActiveToolMode>('text');

  // Annotation state with Undo/Redo stack
  const [annotations, setAnnotations] = useState<PdfAnnotation[]>([]);
  const [historyStack, setHistoryStack] = useState<PdfAnnotation[][]>([]);
  const [redoStack, setRedoStack] = useState<PdfAnnotation[][]>([]);

  // Selection & dragging state
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Tool specific settings
  const [textColor, setTextColor] = useState<string>('#000000');
  const [fontSize, setFontSize] = useState<number>(18);
  const [penColor, setPenColor] = useState<string>('#dc2626');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [highlightColor, setHighlightColor] = useState<string>('#fde047');
  const [ellipseColor, setEllipseColor] = useState<string>('#2563eb');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextContent, setEditingTextContent] = useState<string>('');

  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentDrawPoints, setCurrentDrawPoints] = useState<{ x: number; y: number }[]>([]);

  // Signature Modal state
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [signTab, setSignTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedSignName, setTypedSignName] = useState<string>('John Doe');
  const signCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSignCanvasDrawing, setIsSignCanvasDrawing] = useState<boolean>(false);

  // Dropdown menus
  const [showPageMenu, setShowPageMenu] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  // Canvas element refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageDimensionsMap = useRef<Map<number, { width: number; height: number }>>(new Map());

  // Processing status
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    title: '',
  });

  // Push state to undo history
  const pushHistory = (newAnnotations: PdfAnnotation[]) => {
    setHistoryStack((prev) => [...prev, annotations]);
    setRedoStack([]);
    setAnnotations(newAnnotations);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack((prev) => [annotations, ...prev]);
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));
    setAnnotations(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setHistoryStack((prev) => [...prev, annotations]);
    setAnnotations(next);
  };

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
      setHistoryStack([]);
      setRedoStack([]);
      setCurrentPageIndex(0);

      setProcessingStatus({
        isProcessing: true,
        title: 'Rendering PDF Editor Workspace',
        message: 'Generating high-resolution page thumbnails and visual viewport...',
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
      // Set native internal canvas resolution to match high-DPI rendered image
      canvas.width = currentThumb.width;
      canvas.height = currentThumb.height;

      ctx.save();
      ctx.clearRect(0, 0, currentThumb.width, currentThumb.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
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
          if (ann.shapeType === 'ellipse') {
            ctx.beginPath();
            ctx.ellipse(
              ann.x + ann.width / 2,
              ann.y + ann.height / 2,
              ann.width / 2,
              ann.height / 2,
              0,
              0,
              2 * Math.PI
            );
            ctx.fillStyle = ann.colorHex;
            ctx.globalAlpha = ann.fillOpacity;
            ctx.fill();
            ctx.strokeStyle = ann.strokeColorHex || ann.colorHex;
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.globalAlpha = ann.fillOpacity;
            ctx.fillStyle = ann.colorHex;
            ctx.fillRect(ann.x, ann.y, ann.width, ann.height);
            if (ann.strokeColorHex) {
              ctx.strokeStyle = ann.strokeColorHex;
              ctx.lineWidth = 2;
              ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
            }
          }
          ctx.restore();
        } else if (ann.type === 'text') {
          ctx.save();
          ctx.font = `${ann.fontSize}px sans-serif`;
          ctx.fillStyle = ann.colorHex;
          ctx.fillText(ann.text, ann.x, ann.y + ann.fontSize * 0.8);
          if (selectedAnnId === ann.id) {
            const metrics = ctx.measureText(ann.text);
            ctx.strokeStyle = '#2563eb';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(ann.x - 4, ann.y - 2, metrics.width + 8, ann.fontSize + 6);
          }
          ctx.restore();
        } else if (ann.type === 'image') {
          const annImg = new Image();
          annImg.onload = () => {
            ctx.drawImage(annImg, ann.x, ann.y, ann.width, ann.height);
            if (selectedAnnId === ann.id) {
              ctx.strokeStyle = '#2563eb';
              ctx.lineWidth = 2;
              ctx.strokeRect(ann.x - 2, ann.y - 2, ann.width + 4, ann.height + 4);
            }
          };
          annImg.src = ann.dataUrl;
        }
      }

      // Render in-progress drawing stroke
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

      ctx.restore();
    };
    img.src = currentThumb.dataUrl;
  }, [
    thumbnails,
    currentPageIndex,
    annotations,
    isDrawing,
    currentDrawPoints,
    penColor,
    penWidth,
    zoomLevel,
    selectedAnnId,
  ]);

  const getCanvasCoordinates = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoomLevel / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handleCanvasMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);

    if (activeMode === 'move') {
      return;
    }

    if (activeMode === 'eraser') {
      // Find annotation under mouse and delete it
      const pageAnnots = annotations.filter((a) => a.pageIndex === currentPageIndex);
      const clicked = pageAnnots.find((a) => {
        if (a.type === 'text') {
          return (
            coords.x >= a.x &&
            coords.x <= a.x + 150 &&
            coords.y >= a.y &&
            coords.y <= a.y + a.fontSize + 10
          );
        } else if (a.type === 'shape' || a.type === 'image') {
          return (
            coords.x >= a.x &&
            coords.x <= a.x + a.width &&
            coords.y >= a.y &&
            coords.y <= a.y + a.height
          );
        }
        return false;
      });
      if (clicked) {
        pushHistory(annotations.filter((a) => a.id !== clicked.id));
      }
      return;
    }

    if (activeMode === 'text') {
      const input = prompt('Enter text to place on PDF:', 'Type text here');
      if (input && input.trim()) {
        const newTextAnn: PdfAnnotation = {
          id: Date.now().toString(36),
          type: 'text',
          pageIndex: currentPageIndex,
          x: coords.x,
          y: coords.y,
          text: input.trim(),
          fontSize: fontSize,
          colorHex: textColor,
        };
        pushHistory([...annotations, newTextAnn]);
      }
    } else if (activeMode === 'editText') {
      // Find text annotation to edit
      const target = annotations.find(
        (a) =>
          a.pageIndex === currentPageIndex &&
          a.type === 'text' &&
          coords.x >= a.x - 10 &&
          coords.x <= a.x + 200 &&
          coords.y >= a.y - 10 &&
          coords.y <= a.y + 40
      );
      if (target && target.type === 'text') {
        const updated = prompt('Edit text content:', target.text);
        if (updated !== null && updated.trim()) {
          pushHistory(
            annotations.map((a) => (a.id === target.id ? { ...a, text: updated.trim() } : a))
          );
        }
      }
    } else if (activeMode === 'pencil') {
      setIsDrawing(true);
      setCurrentDrawPoints([coords]);
    } else if (activeMode === 'highlight') {
      const newHighlight: PdfAnnotation = {
        id: Date.now().toString(36),
        type: 'shape',
        pageIndex: currentPageIndex,
        x: coords.x,
        y: coords.y,
        width: 180,
        height: 24,
        shapeType: 'highlight',
        colorHex: highlightColor,
        fillOpacity: 0.45,
      };
      pushHistory([...annotations, newHighlight]);
    } else if (activeMode === 'ellipse') {
      const newEllipse: PdfAnnotation = {
        id: Date.now().toString(36),
        type: 'shape',
        pageIndex: currentPageIndex,
        x: coords.x,
        y: coords.y,
        width: 100,
        height: 60,
        shapeType: 'ellipse',
        colorHex: ellipseColor,
        fillOpacity: 0.3,
        strokeColorHex: ellipseColor,
      };
      pushHistory([...annotations, newEllipse]);
    } else if (activeMode === 'cross') {
      // Stamp Red Cross
      const newCross: PdfAnnotation = {
        id: Date.now().toString(36),
        type: 'text',
        pageIndex: currentPageIndex,
        x: coords.x,
        y: coords.y,
        text: '❌',
        fontSize: 28,
        colorHex: '#dc2626',
      };
      pushHistory([...annotations, newCross]);
    } else if (activeMode === 'check') {
      // Stamp Green Checkmark
      const newCheck: PdfAnnotation = {
        id: Date.now().toString(36),
        type: 'text',
        pageIndex: currentPageIndex,
        x: coords.x,
        y: coords.y,
        text: '✓',
        fontSize: 32,
        colorHex: '#16a34a',
      };
      pushHistory([...annotations, newCheck]);
    } else if (activeMode === 'annotation') {
      const comment = prompt('Enter sticky note / comment annotation:', 'Note: Review this section');
      if (comment && comment.trim()) {
        const newNote: PdfAnnotation = {
          id: Date.now().toString(36),
          type: 'text',
          pageIndex: currentPageIndex,
          x: coords.x,
          y: coords.y,
          text: `💬 ${comment.trim()}`,
          fontSize: 14,
          colorHex: '#d97706',
        };
        pushHistory([...annotations, newNote]);
      }
    } else if (activeMode === 'link') {
      const url = prompt('Enter URL link for hyperlink box:', 'https://');
      if (url && url.trim()) {
        const newLink: PdfAnnotation = {
          id: Date.now().toString(36),
          type: 'text',
          pageIndex: currentPageIndex,
          x: coords.x,
          y: coords.y,
          text: `🔗 ${url.trim()}`,
          fontSize: 14,
          colorHex: '#2563eb',
        };
        pushHistory([...annotations, newLink]);
      }
    }
  };

  const handleCanvasMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (activeMode === 'pencil' && isDrawing) {
      const coords = getCanvasCoordinates(e);
      setCurrentDrawPoints((prev) => [...prev, coords]);
    }
  };

  const handleCanvasMouseUp = () => {
    if (activeMode === 'pencil' && isDrawing) {
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
        pushHistory([...annotations, newDrawAnn]);
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
          x: 60,
          y: 60,
          width: 150,
          height: 90,
          dataUrl,
        };
        pushHistory([...annotations, newImgAnn]);
      }
    };
    reader.readAsDataURL(imgFile);
    e.target.value = '';
  };

  // Insert drawn / typed signature from Modal
  const handleInsertSignature = () => {
    if (signTab === 'type') {
      if (!typedSignName.trim()) return;
      // Convert typed name to cursive SVG image canvas
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 300, 100);
        ctx.font = '36px "Dancing Script", cursive, "Brush Script MT", sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(typedSignName, 20, 60);
        const dataUrl = canvas.toDataURL('image/png');
        const newSignAnn: PdfAnnotation = {
          id: Date.now().toString(36),
          type: 'image',
          pageIndex: currentPageIndex,
          x: 100,
          y: 100,
          width: 160,
          height: 55,
          dataUrl,
        };
        pushHistory([...annotations, newSignAnn]);
      }
    } else if (signTab === 'draw' && signCanvasRef.current) {
      const dataUrl = signCanvasRef.current.toDataURL('image/png');
      const newSignAnn: PdfAnnotation = {
        id: Date.now().toString(36),
        type: 'image',
        pageIndex: currentPageIndex,
        x: 100,
        y: 100,
        width: 160,
        height: 60,
        dataUrl,
      };
      pushHistory([...annotations, newSignAnn]);
    }
    setShowSignModal(false);
  };

  const handleClearPage = () => {
    pushHistory(annotations.filter((a) => a.pageIndex !== currentPageIndex));
  };

  const handleExport = async () => {
    if (!arrayBuffer || !file) return;

    setProcessingStatus({
      isProcessing: true,
      title: 'Exporting Edited PDF',
      message: 'Burning all annotations, text, signatures & drawings into PDF pages...',
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

  // Helper item list for top toolbar tools
  const toolbarTools = [
    {
      id: 'text' as ActiveToolMode,
      icon: Type,
      label: 'Add Text',
      hasDropdown: false,
    },
    {
      id: 'editText' as ActiveToolMode,
      icon: Edit3,
      label: 'Edit Text',
      hasDropdown: false,
    },
    {
      id: 'eraser' as ActiveToolMode,
      icon: Eraser,
      label: 'Eraser',
      hasDropdown: true,
    },
    {
      id: 'highlight' as ActiveToolMode,
      icon: Highlighter,
      label: 'Highlight',
      hasDropdown: true,
    },
    {
      id: 'pencil' as ActiveToolMode,
      icon: Pencil,
      label: 'Pencil',
      hasDropdown: false,
    },
    {
      id: 'image' as ActiveToolMode,
      icon: ImageIcon,
      label: 'Image',
      hasDropdown: true,
      isImagePicker: true,
    },
    {
      id: 'ellipse' as ActiveToolMode,
      icon: Circle,
      label: 'Ellipse',
      hasDropdown: true,
    },
    {
      id: 'cross' as ActiveToolMode,
      icon: X,
      label: 'Cross',
      hasDropdown: false,
    },
    {
      id: 'check' as ActiveToolMode,
      icon: Check,
      label: 'Check',
      hasDropdown: false,
    },
    {
      id: 'sign' as ActiveToolMode,
      icon: PenTool,
      label: 'Sign',
      hasDropdown: false,
      onClickOverride: () => setShowSignModal(true),
    },
    {
      id: 'annotation' as ActiveToolMode,
      icon: MessageSquare,
      label: 'Annotati...',
      hasDropdown: false,
    },
    {
      id: 'link' as ActiveToolMode,
      icon: Link,
      label: 'Links',
      hasDropdown: false,
    },
    {
      id: 'more' as ActiveToolMode,
      icon: Wand2,
      label: 'More tools',
      hasDropdown: true,
      onClickOverride: () => setShowMoreMenu((prev) => !prev),
    },
  ];

  return (
    <div className="w-full flex flex-col min-h-[750px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-300 shadow-xl">
      <ProcessingOverlay status={processingStatus} />

      {!file ? (
        <div className="p-8">
          <DropZone
            accept="pdf"
            title="Upload PDF Document to Edit"
            subtitle="Full professional PDF editor: Add text, signatures, freehand drawing, stamps, whiteout & highlights"
            onFilesSelected={handleFileSelected}
          />
        </div>
      ) : (
        <div className="flex flex-col flex-1 relative select-none">
          {/* TOP DOCUMENT HEADER */}
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {file.name}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">{formatFileSize(file.size)}</span>
              <span className="text-slate-400">•</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-indigo-300 font-semibold">
                {thumbnails.length} {thumbnails.length === 1 ? 'Page' : 'Pages'}
              </span>
              {annotations.length > 0 && (
                <span className="bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">
                  {annotations.length} edits
                </span>
              )}
            </div>

            <button
              onClick={handleExport}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export &amp; Download PDF</span>
            </button>
          </div>

          {/* TOP MAIN TOOLBAR (Icons matching screenshot) */}
          <div className="bg-white border-b border-slate-200 shadow-xs px-2 py-1.5 flex items-center justify-between overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1">
              {/* 1. Thumbnails Toggle */}
              <button
                onClick={() => setShowThumbnails((prev) => !prev)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer min-w-[58px] ${
                  showThumbnails
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Toggle Sidebar Page Thumbnails"
              >
                <div className="flex items-center gap-0.5">
                  <LayoutGrid className="w-4 h-4" />
                  <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                </div>
                <span className="mt-0.5 text-[10px] truncate max-w-[54px]">Thumbna...</span>
              </button>

              {/* 2. Move (Pan) Tool */}
              <button
                onClick={() => setActiveMode('move')}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer min-w-[48px] ${
                  activeMode === 'move'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Hand Pan Move Mode"
              >
                <Hand className="w-4 h-4" />
                <span className="mt-0.5 text-[10px]">Move</span>
              </button>

              {/* 3. Undo */}
              <button
                disabled={historyStack.length === 0}
                onClick={handleUndo}
                className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer min-w-[48px]"
                title="Undo edit"
              >
                <Undo2 className="w-4 h-4" />
                <span className="mt-0.5 text-[10px]">Undo</span>
              </button>

              {/* 4. Redo */}
              <button
                disabled={redoStack.length === 0}
                onClick={handleRedo}
                className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer min-w-[48px]"
                title="Redo edit"
              >
                <Redo2 className="w-4 h-4" />
                <span className="mt-0.5 text-[10px]">Redo</span>
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-slate-200 mx-1.5" />

              {/* Toolbar Tools */}
              {toolbarTools.map((tool) => {
                const IconComponent = tool.icon;
                const isActive = activeMode === tool.id;

                if (tool.isImagePicker) {
                  return (
                    <label
                      key={tool.id}
                      className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer min-w-[50px]"
                      title="Upload & Place Image"
                    >
                      <div className="flex items-center gap-0.5">
                        <IconComponent className="w-4 h-4 text-indigo-600" />
                        <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                      </div>
                      <span className="mt-0.5 text-[10px]">Image</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  );
                }

                return (
                  <button
                    key={tool.id}
                    onClick={tool.onClickOverride || (() => setActiveMode(tool.id))}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer min-w-[52px] ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title={tool.label}
                  >
                    <div className="flex items-center gap-0.5">
                      <IconComponent className="w-4 h-4" />
                      {tool.hasDropdown && <ChevronDown className="w-2.5 h-2.5 opacity-70" />}
                    </div>
                    <span className="mt-0.5 text-[10px] truncate max-w-[56px]">{tool.label}</span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className="h-8 w-px bg-slate-200 mx-1.5" />

              {/* Document Page Tools */}
              <button
                onClick={() => setZoomLevel((prev) => (prev === 100 ? 125 : 100))}
                className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium text-slate-700 hover:bg-slate-100 cursor-pointer min-w-[58px]"
                title="Toggle Fit Width / Page View"
              >
                <Layout className="w-4 h-4 text-slate-600" />
                <span className="mt-0.5 text-[10px]">Page lay...</span>
              </button>

              <button
                onClick={() => handleClearPage()}
                className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 cursor-pointer min-w-[58px]"
                title="Clear current page annotations"
              >
                <Files className="w-4 h-4 text-slate-600" />
                <span className="mt-0.5 text-[10px]">Manage ...</span>
              </button>
            </div>
          </div>

          {/* TOOL OPTIONS SUB-BAR (Contextual Controls) */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-900 capitalize flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Active Mode: <span className="text-indigo-600 font-extrabold">{activeMode}</span>
              </span>

              {activeMode === 'text' && (
                <div className="flex items-center gap-3 border-l border-slate-300 pl-3">
                  <label className="flex items-center gap-1.5">
                    <span>Text Color:</span>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border p-0.5 bg-white"
                    />
                  </label>
                  <label className="flex items-center gap-1.5">
                    <span>Font Size:</span>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="px-2 py-1 rounded border bg-white font-medium text-xs"
                    >
                      <option value={12}>12 px</option>
                      <option value={16}>16 px</option>
                      <option value={18}>18 px</option>
                      <option value={24}>24 px</option>
                      <option value={32}>32 px</option>
                    </select>
                  </label>
                  <span className="text-slate-400 italic">💡 Click on PDF to add text</span>
                </div>
              )}

              {activeMode === 'pencil' && (
                <div className="flex items-center gap-3 border-l border-slate-300 pl-3">
                  <label className="flex items-center gap-1.5">
                    <span>Stroke Color:</span>
                    <input
                      type="color"
                      value={penColor}
                      onChange={(e) => setPenColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border p-0.5 bg-white"
                    />
                  </label>
                  <label className="flex items-center gap-1.5">
                    <span>Stroke Width:</span>
                    <select
                      value={penWidth}
                      onChange={(e) => setPenWidth(Number(e.target.value))}
                      className="px-2 py-1 rounded border bg-white font-medium text-xs"
                    >
                      <option value={2}>Fine (2px)</option>
                      <option value={4}>Medium (4px)</option>
                      <option value={8}>Thick (8px)</option>
                    </select>
                  </label>
                  <span className="text-slate-400 italic">💡 Drag mouse on page to draw</span>
                </div>
              )}

              {activeMode === 'highlight' && (
                <div className="flex items-center gap-3 border-l border-slate-300 pl-3">
                  <label className="flex items-center gap-1.5">
                    <span>Highlight Color:</span>
                    <input
                      type="color"
                      value={highlightColor}
                      onChange={(e) => setHighlightColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border p-0.5 bg-white"
                    />
                  </label>
                  <span className="text-slate-400 italic">
                    💡 Click on page to place highlight box
                  </span>
                </div>
              )}

              {activeMode === 'ellipse' && (
                <div className="flex items-center gap-3 border-l border-slate-300 pl-3">
                  <label className="flex items-center gap-1.5">
                    <span>Shape Color:</span>
                    <input
                      type="color"
                      value={ellipseColor}
                      onChange={(e) => setEllipseColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border p-0.5 bg-white"
                    />
                  </label>
                  <span className="text-slate-400 italic">💡 Click to place circle shape</span>
                </div>
              )}

              {activeMode === 'eraser' && (
                <span className="text-rose-600 font-medium italic border-l border-slate-300 pl-3">
                  ⚠️ Click any text, shape or drawn element on the page to erase it
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearPage}
                className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Current Page</span>
              </button>
            </div>
          </div>

          {/* MAIN EDITOR WORKSPACE (Sidebar + Viewport) */}
          <div className="flex flex-1 relative min-h-[580px] bg-slate-200/80 overflow-hidden">
            {/* LEFT SIDEBAR THUMBNAILS PANEL */}
            {showThumbnails && (
              <div
                style={{ width: `${sidebarWidth}px` }}
                className="bg-white border-r border-slate-300 p-3 flex flex-col gap-4 overflow-y-auto shrink-0 select-none shadow-inner"
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Page Thumbnails ({thumbnails.length})
                </div>

                <div className="space-y-4">
                  {thumbnails.map((thumb, idx) => {
                    const isSelected = idx === currentPageIndex;
                    return (
                      <div
                        key={idx}
                        onClick={() => setCurrentPageIndex(idx)}
                        className={`flex flex-col items-center gap-1.5 cursor-pointer group transition-all`}
                      >
                        <div
                          className={`relative rounded-md overflow-hidden bg-white shadow-md border-2 transition-all ${
                            isSelected
                              ? 'border-indigo-600 ring-2 ring-indigo-300 scale-[1.02]'
                              : 'border-slate-300 group-hover:border-slate-400'
                          }`}
                        >
                          <img
                            src={thumb.dataUrl}
                            alt={`Page ${idx + 1}`}
                            className="w-36 h-auto object-contain bg-white"
                          />
                        </div>

                        {/* Page Number Badge underneath matching screenshot */}
                        <div
                          className={`px-3 py-0.5 rounded text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CANVAS WORKSPACE VIEWPORT */}
            <div
              ref={containerRef}
              className="flex-1 p-8 overflow-auto flex items-center justify-center relative min-h-[550px]"
            >
              {(() => {
                const currentThumb = thumbnails[currentPageIndex];
                const displayScale = zoomLevel / 100;
                const baseDisplayWidth = currentThumb ? Math.min(850, currentThumb.width) : 800;
                const cssWidth = baseDisplayWidth * displayScale;
                const cssHeight = currentThumb
                  ? (baseDisplayWidth / currentThumb.width) * currentThumb.height * displayScale
                  : 1100;

                return (
                  <div
                    className="relative shadow-2xl rounded-lg overflow-hidden bg-white border border-slate-300 transition-all duration-150 shrink-0"
                    style={{ width: `${cssWidth}px`, height: `${cssHeight}px` }}
                  >
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      style={{ width: '100%', height: '100%' }}
                      className={`${
                        activeMode === 'pencil'
                          ? 'cursor-crosshair'
                          : activeMode === 'eraser'
                          ? 'cursor-pointer'
                          : activeMode === 'move'
                          ? 'cursor-grab'
                          : 'cursor-crosshair'
                      }`}
                    />
                  </div>
                );
              })()}

              {/* FLOATING DARK CONTROL PILL BAR AT BOTTOM CENTER (Exact matching screenshot) */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1e293b] text-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-4 text-xs font-medium select-none backdrop-blur-md bg-opacity-95">
                {/* Page Navigation Indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-300 font-normal">Page:</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowPageMenu((prev) => !prev)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer border border-slate-600/50"
                    >
                      <ChevronUp className="w-3 h-3 text-slate-400" />
                      <span>
                        {currentPageIndex + 1}/{thumbnails.length}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {showPageMenu && (
                      <div className="absolute bottom-full mb-2 left-0 w-32 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-1 z-50 text-xs max-h-48 overflow-y-auto">
                        {thumbnails.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setCurrentPageIndex(i);
                              setShowPageMenu(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                              i === currentPageIndex
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            Page {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-4 w-px bg-slate-700" />

                {/* Zoom In (+) */}
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(200, prev + 25))}
                  className="p-1.5 rounded-full hover:bg-slate-700 transition-all cursor-pointer text-slate-200 hover:text-white"
                  title="Zoom In (+25%)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Zoom Out (-) */}
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(50, prev - 25))}
                  className="p-1.5 rounded-full hover:bg-slate-700 transition-all cursor-pointer text-slate-200 hover:text-white"
                  title="Zoom Out (-25%)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-700" />

                {/* Hand Pan Tool */}
                <button
                  onClick={() => setActiveMode('move')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    activeMode === 'move'
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Hand Pan Move Mode"
                >
                  <Hand className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE DRAW / TYPE MODAL */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600" />
                <span>Add Signature to PDF</span>
              </h3>
              <button
                onClick={() => setShowSignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSignTab('draw')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  signTab === 'draw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Draw Signature
              </button>
              <button
                onClick={() => setSignTab('type')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  signTab === 'type' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Type Signature
              </button>
            </div>

            {signTab === 'draw' ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Draw signature below using mouse or pen:</p>
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <canvas
                    ref={signCanvasRef}
                    width={380}
                    height={120}
                    onMouseDown={(e) => {
                      setIsSignCanvasDrawing(true);
                      const canvas = signCanvasRef.current;
                      if (!canvas) return;
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;
                      const rect = canvas.getBoundingClientRect();
                      ctx.beginPath();
                      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                      ctx.strokeStyle = '#0f172a';
                      ctx.lineWidth = 2.5;
                      ctx.lineCap = 'round';
                    }}
                    onMouseMove={(e) => {
                      if (!isSignCanvasDrawing) return;
                      const canvas = signCanvasRef.current;
                      if (!canvas) return;
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;
                      const rect = canvas.getBoundingClientRect();
                      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                      ctx.stroke();
                    }}
                    onMouseUp={() => setIsSignCanvasDrawing(false)}
                    className="w-full h-[120px] bg-white cursor-crosshair"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-700">Type Your Full Name:</label>
                <input
                  type="text"
                  value={typedSignName}
                  onChange={(e) => setTypedSignName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Aarav Sharma"
                />
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center min-h-[80px]">
                  <span className="text-3xl text-slate-900 font-serif italic tracking-wide">
                    {typedSignName || 'Signature Preview'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertSignature}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer"
              >
                Insert Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
