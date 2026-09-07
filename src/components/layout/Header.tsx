import React from 'react';
import { ShieldCheck, FileCheck2, HardDriveDownload, HelpCircle } from 'lucide-react';
import { SecurityBadge } from '../common/SecurityBadge';
import type { PdfToolId } from '../../types';
import type { LegalPageId } from '../legal/legalContent';

interface HeaderProps {
  activeTool: PdfToolId;
  onSelectTool: (id: PdfToolId) => void;
  onOpenLegal: (pageId: LegalPageId) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTool, onSelectTool, onOpenLegal }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div
            onClick={() => onSelectTool('merge')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  DocuShield <span className="text-indigo-600">PDF</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v1.0 Client-Side
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                High-Performance In-Browser PDF Suite
              </p>
            </div>
          </div>

          {/* Security & Client-Side Prominent Guarantee + Legal Link */}
          <div className="flex items-center gap-2 sm:gap-4">
            <SecurityBadge variant="compact" />
            
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Privacy &amp; Terms</span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono">
              <HardDriveDownload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hostinger Static Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
