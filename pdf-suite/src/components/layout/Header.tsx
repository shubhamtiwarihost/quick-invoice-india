import React, { useState, useRef, useEffect } from 'react';
import {
  FileCheck2,
  FileText,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  Shield,
  Layers,
  Scissors,
  RotateCw,
  Trash2,
  Image,
  Images,
  Stamp,
  Lock,
  LayoutGrid,
  ArrowRight,
} from 'lucide-react';
import { SecurityBadge } from '../common/SecurityBadge';
import { TOOLS_CONFIG } from './Navigation';
import type { PdfToolId } from '../../types';
import type { LegalPageId } from '../legal/legalContent';

interface HeaderProps {
  activeTool: PdfToolId | null;
  onSelectTool: (id: PdfToolId) => void;
  onGoHome?: () => void;
  onOpenLegal: (pageId: LegalPageId) => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTool,
  onSelectTool,
  onGoHome,
  onOpenLegal,
  onOpenAdmin,
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getToolIcon = (id: PdfToolId, className = 'w-4 h-4') => {
    switch (id) {
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
        return <Layers className={className} />;
    }
  };

  const handleToolClick = (id: PdfToolId) => {
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
    onSelectTool(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => {
              setToolsDropdownOpen(false);
              setMobileMenuOpen(false);
              if (onGoHome) onGoHome();
              else onSelectTool('merge');
            }}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  SwiftGST <span className="text-indigo-600">PDF</span>
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                Free In-Browser PDF Suite
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* All Tools Button */}
            <button
              onClick={() => {
                setToolsDropdownOpen(false);
                if (onGoHome) onGoHome();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTool === null
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>All Tools</span>
            </button>

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  toolsDropdownOpen || activeTool !== null
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    toolsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Tools Dropdown Menu */}
              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Select a PDF Tool
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                      8 Tools
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                    {TOOLS_CONFIG.map((tool) => {
                      const isCurrent = activeTool === tool.id;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleToolClick(tool.id)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isCurrent
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {getToolIcon(tool.id, 'w-4 h-4')}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 leading-tight">
                              {tool.title}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {tool.shortDesc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setToolsDropdownOpen(false);
                        if (onGoHome) onGoHome();
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <span>Explore Tools Grid</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Direct Nav Links */}
            <button
              onClick={() => onSelectTool('merge')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTool === 'merge'
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Merge
            </button>
            <button
              onClick={() => onSelectTool('split')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTool === 'split'
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => onSelectTool('images-to-pdf')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTool === 'images-to-pdf'
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Images to PDF
            </button>

            {/* Direct Admin Dashboard Link */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Admin Dashboard"
            >
              <Shield className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors shadow-2xs"
              title="Return to SwiftGST Invoicing & Billing"
            >
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">SwiftGST Invoice</span>
              <span className="sm:hidden">SwiftGST</span>
            </a>

            <SecurityBadge variant="compact" />

            <button
              onClick={() => onOpenLegal('privacy')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Privacy</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 animate-in fade-in duration-150">
          <div className="pb-2 border-b border-slate-100">
            <a
              href="/"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200"
            >
              <FileText className="w-4 h-4 text-teal-700" />
              <span>← Back to SwiftGST Billing &amp; Invoicing</span>
            </a>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              All PDF Utilities
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGoHome) onGoHome();
              }}
              className="text-xs font-semibold text-indigo-600"
            >
              Home View
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {TOOLS_CONFIG.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                  activeTool === tool.id
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="text-indigo-600 shrink-0">
                  {getToolIcon(tool.id, 'w-4 h-4')}
                </div>
                <span className="text-xs font-semibold truncate">{tool.title}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600"
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Admin Dashboard</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLegal('privacy');
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
