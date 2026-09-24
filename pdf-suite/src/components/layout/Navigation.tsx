import React from 'react';
import {
  Edit3,
  Layers,
  Scissors,
  RotateCw,
  Trash2,
  Image,
  Images,
  Stamp,
  Lock,
  LayoutGrid,
} from 'lucide-react';
import type { PdfToolId, ToolMetadata } from '../../types';

export const TOOLS_CONFIG: ToolMetadata[] = [
  {
    id: 'edit',
    title: 'Edit PDF',
    shortDesc: 'Add text, freehand drawings, highlight boxes, and signatures to PDF pages',
    badge: 'New Editor',
    iconName: 'Edit3',
  },
  {
    id: 'merge',
    title: 'Merge PDF',
    shortDesc: 'Combine multiple PDFs into a single file with custom ordering',
    badge: 'Popular',
    iconName: 'Layers',
  },
  {
    id: 'split',
    title: 'Split / Extract Pages',
    shortDesc: 'Visually select page thumbnails or ranges to export new PDFs',
    iconName: 'Scissors',
  },
  {
    id: 'rotate',
    title: 'Rotate PDF',
    shortDesc: 'Rotate individual pages or all pages 90°/180° clockwise',
    iconName: 'RotateCw',
  },
  {
    id: 'delete',
    title: 'Delete Pages',
    shortDesc: 'Remove unwanted pages with instant visual thumbnail deletion',
    iconName: 'Trash2',
  },
  {
    id: 'images-to-pdf',
    title: 'Images to PDF',
    shortDesc: 'Convert JPG, PNG, and WebP images into a unified PDF document',
    iconName: 'Image',
  },
  {
    id: 'pdf-to-images',
    title: 'PDF to Images',
    shortDesc: 'Render PDF pages into high-res PNGs or download as a ZIP',
    iconName: 'Images',
  },
  {
    id: 'watermark',
    title: 'Watermark PDF',
    shortDesc: 'Add customizable text watermarks with angle, opacity, & position',
    iconName: 'Stamp',
  },
  {
    id: 'protect',
    title: 'Protect PDF',
    shortDesc: 'Encrypt your PDF with a password locally before download',
    badge: 'Encrypted',
    iconName: 'Lock',
  },
];

interface NavigationProps {
  activeTool: PdfToolId | null;
  onSelectTool: (id: PdfToolId) => void;
  onGoHome?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTool, onSelectTool, onGoHome }) => {
  const getIcon = (id: PdfToolId, className = 'w-4 h-4') => {
    switch (id) {
      case 'edit':
        return <Edit3 className={className} />;
      case 'merge':
        return <Layers className={className} />;
      case 'split':
        return <Scissors className={className} />;
      case 'rotate':
        return <RotateCw className={className} />;
      case 'delete':
        return <Trash2 className={className} />;
      case 'images-to-pdf':
        return <Image className={className} />;
      case 'pdf-to-images':
        return <Images className={className} />;
      case 'watermark':
        return <Stamp className={className} />;
      case 'protect':
        return <Lock className={className} />;
      default:
        return <Edit3 className={className} />;
    }
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 py-3">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTool === null
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid
                className={`w-4 h-4 ${
                  activeTool === null ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                }`}
              />
              <span>All Tools</span>
            </button>
          )}

          {TOOLS_CONFIG.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                  }`}
                >
                  {getIcon(tool.id, 'w-4 h-4')}
                </span>
                <span>{tool.title}</span>
                {tool.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-indigo-700/80 text-white'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
