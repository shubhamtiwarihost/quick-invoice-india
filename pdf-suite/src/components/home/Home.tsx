import React from 'react';
import {
  Layers,
  Scissors,
  RotateCw,
  Trash2,
  Image,
  Images,
  Stamp,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HardDrive,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { TOOLS_CONFIG } from '../layout/Navigation';
import { AdBanner } from '../ads/AdBanner';
import type { PdfToolId } from '../../types';

interface HomeProps {
  onSelectTool: (id: PdfToolId) => void;
  onOpenLegal?: (pageId: any) => void;
  onOpenAdmin?: () => void;
}

const TOOL_META_EXTENDED: Record<
  PdfToolId,
  {
    themeColor: string;
    iconBg: string;
    borderHover: string;
    tag: string;
    bullets: string[];
  }
> = {
  merge: {
    themeColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    borderHover: 'hover:border-indigo-500',
    tag: 'Reorder & Combine',
    bullets: ['Drag & drop reordering', 'Unlimited file uploads', 'Preserves bookmarks'],
  },
  split: {
    themeColor: 'text-blue-600',
    iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    borderHover: 'hover:border-blue-500',
    tag: 'Thumbnail Picker',
    bullets: ['Visual thumbnail selector', 'Custom page range input', 'Individual page export'],
  },
  rotate: {
    themeColor: 'text-amber-600',
    iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    borderHover: 'hover:border-amber-500',
    tag: '90° / 180° / 270°',
    bullets: ['Rotate single or all pages', 'Lossless vector preservation', 'Real-time orientation view'],
  },
  delete: {
    themeColor: 'text-rose-600',
    iconBg: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    borderHover: 'hover:border-rose-500',
    tag: 'Instant Removal',
    bullets: ['Click-to-strike thumbnails', 'Batch page removal', 'Instant clean download'],
  },
  'images-to-pdf': {
    themeColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    borderHover: 'hover:border-emerald-500',
    tag: 'JPG, PNG, WebP',
    bullets: ['Multiple image formats', 'A4 & Letter auto-fit', 'Adjustable page margins'],
  },
  'pdf-to-images': {
    themeColor: 'text-violet-600',
    iconBg: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    borderHover: 'hover:border-violet-500',
    tag: 'High-Res & ZIP',
    bullets: ['Sharp 150 DPI render', 'Single click ZIP download', 'Individual PNG save'],
  },
  watermark: {
    themeColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
    borderHover: 'hover:border-cyan-500',
    tag: 'Custom Stamp',
    bullets: ['Diagonal or center overlay', 'Custom opacity & color', 'Adjustable rotation angle'],
  },
  protect: {
    themeColor: 'text-purple-600',
    iconBg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
    borderHover: 'hover:border-purple-500',
    tag: 'AES Encrypted',
    bullets: ['In-browser encryption', 'Owner & User passwords', 'Standard reader support'],
  },
};

export const Home: React.FC<HomeProps> = ({ onSelectTool, onOpenLegal, onOpenAdmin }) => {
  const getToolIcon = (id: PdfToolId, className = 'w-6 h-6') => {
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

  return (
    <div className="w-full">
      {/* 1. Modern High-Converting Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-4 pb-10 sm:pb-14 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide mb-5 shadow-2xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>SwiftGST PDF Tools Suite</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Every PDF Tool You Need.{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-indigo-700 to-violet-600">
            Fast &amp; Free.
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Merge, rotate, delete pages, watermark, encrypt, and convert PDFs directly inside
          your browser memory. Your confidential documents never leave your computer.
        </p>

        {/* Value Prop Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-600">
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Secure In-Browser Tools</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-xs">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant In-Memory Processing</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-xs">
            <HardDrive className="w-4 h-4 text-indigo-500" />
            <span>No File Size Restrictions</span>
          </div>
        </div>
      </section>

      {/* 2. Modern High-Converting Tools Grid Section */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                All 8 PDF Utilities
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Select any tool below to launch its dedicated in-browser workspace immediately.
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              8 Free Tools
            </span>
          </div>
        </div>

        {/* 8 Clickable Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS_CONFIG.map((tool) => {
            const meta = TOOL_META_EXTENDED[tool.id];
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className={`group relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-xl ${meta.borderHover} hover:-translate-y-1.5 transition-all duration-200 cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  {/* Card Header: Icon & Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${meta.iconBg}`}
                    >
                      {getToolIcon(tool.id, 'w-6 h-6')}
                    </div>

                    {tool.badge ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {tool.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {meta.tag}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed min-h-[36px]">
                    {tool.shortDesc}
                  </p>

                  {/* Bullet Highlights */}
                  <ul className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    {meta.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>Launch Tool</span>
                  <div className="w-7 h-7 rounded-full bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Mid-Page Ad Placement (CLS Safe) */}
      <div className="my-10">
        <AdBanner format="horizontal" />
      </div>

      {/* 4. Strict Zero-Server Privacy Guarantee Section */}
      <section className="bg-linear-to-b from-indigo-950 via-slate-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-800/60 border border-indigo-700/60 text-indigo-200 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Knowledge Security Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why In-Browser PDF Processing is Safer
          </h2>

          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            Most online PDF services silently upload your tax records, personal invoices, and ID
            scans to remote cloud storage. SwiftGST operates differently: the cryptographic
            and PDF parsing code runs inside your local browser tab via modern Web standards.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-indigo-800/60">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero Network POST
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                No file bytes are ever sent over HTTP/HTTPS requests to our servers.
              </p>
            </div>

            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Instant Conversion
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                No server wait queues or upload delays. Works with PDFs up to 10 MB and 100 pages.
              </p>
            </div>

            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-400" />
                Hostinger Ready
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Zero backend runtime needed. Deploys cleanly to any static web host.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
