import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, TOOLS_CONFIG } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { SecurityBadge } from './components/common/SecurityBadge';
import { AdBanner } from './components/ads/AdBanner';
import { LegalModal } from './components/legal/LegalModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import type { LegalPageId } from './components/legal/legalContent';
import { initAnalytics } from './utils/tracker';
import { MergePdfTool } from './components/tools/MergePdfTool';
import { SplitPdfTool } from './components/tools/SplitPdfTool';
import { RotatePdfTool } from './components/tools/RotatePdfTool';
import { DeletePagesTool } from './components/tools/DeletePagesTool';
import { ImagesToPdfTool } from './components/tools/ImagesToPdfTool';
import { PdfToImagesTool } from './components/tools/PdfToImagesTool';
import { WatermarkPdfTool } from './components/tools/WatermarkPdfTool';
import { ProtectPdfTool } from './components/tools/ProtectPdfTool';
import type { PdfToolId } from './types';
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
  ArrowLeft,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HardDrive,
  FileCheck2,
} from 'lucide-react';

const TOOL_CARDS_METADATA: Record<PdfToolId, { colorClass: string; iconBg: string; tag: string }> = {
  merge: {
    colorClass: 'text-indigo-600',
    iconBg: 'bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white',
    tag: 'Reorder & Combine',
  },
  split: {
    colorClass: 'text-blue-600',
    iconBg: 'bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white',
    tag: 'Thumbnail Picker',
  },
  rotate: {
    colorClass: 'text-amber-600',
    iconBg: 'bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white',
    tag: '90° / 180° / 270°',
  },
  delete: {
    colorClass: 'text-rose-600',
    iconBg: 'bg-rose-50 group-hover:bg-rose-600 text-rose-600 group-hover:text-white',
    tag: 'Instant Removal',
  },
  'images-to-pdf': {
    colorClass: 'text-emerald-600',
    iconBg: 'bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white',
    tag: 'JPG, PNG, WebP',
  },
  'pdf-to-images': {
    colorClass: 'text-violet-600',
    iconBg: 'bg-violet-50 group-hover:bg-violet-600 text-violet-600 group-hover:text-white',
    tag: 'High-Res & ZIP',
  },
  watermark: {
    colorClass: 'text-cyan-600',
    iconBg: 'bg-cyan-50 group-hover:bg-cyan-600 text-cyan-600 group-hover:text-white',
    tag: 'Custom Stamp',
  },
  protect: {
    colorClass: 'text-purple-600',
    iconBg: 'bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white',
    tag: 'AES Encrypted',
  },
};

export const App: React.FC = () => {
  // Initialize tool from hash if present, or null for home card view
  const [activeTool, setActiveTool] = useState<PdfToolId | null>(() => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (TOOLS_CONFIG.some((t) => t.id === hash)) {
      return hash as PdfToolId;
    }
    return null;
  });

  const [legalModalPage, setLegalModalPage] = useState<LegalPageId | null>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname === '/admin' ||
      window.location.pathname.endsWith('/admin') ||
      window.location.hash === '#admin'
    );
  });

  // Initialize analytics on boot
  useEffect(() => {
    initAnalytics();
  }, []);

  // Sync hash and pathname routing for deep links & admin
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '').toLowerCase();

      if (path === '/admin' || path.endsWith('/admin') || hash === 'admin') {
        setIsAdminView(true);
        return;
      }

      setIsAdminView(false);

      if (['privacy', 'terms', 'about', 'contact'].includes(hash)) {
        setLegalModalPage(hash as LegalPageId);
      } else if (TOOLS_CONFIG.some((t) => t.id === hash)) {
        setActiveTool(hash as PdfToolId);
      } else if (!hash) {
        setActiveTool(null);
      }
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleSelectTool = (id: PdfToolId) => {
    setIsAdminView(false);
    setActiveTool(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setIsAdminView(false);
    setActiveTool(null);
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (pageId: LegalPageId) => {
    setLegalModalPage(pageId);
    window.location.hash = pageId;
  };

  const handleCloseLegal = () => {
    setLegalModalPage(null);
    if (activeTool) {
      window.location.hash = activeTool;
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleBackFromAdmin = () => {
    setIsAdminView(false);
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
    if (activeTool) {
      window.location.hash = activeTool;
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const renderToolComponent = () => {
    switch (activeTool) {
      case 'merge':
        return <MergePdfTool />;
      case 'split':
        return <SplitPdfTool />;
      case 'rotate':
        return <RotatePdfTool />;
      case 'delete':
        return <DeletePagesTool />;
      case 'images-to-pdf':
        return <ImagesToPdfTool />;
      case 'pdf-to-images':
        return <PdfToImagesTool />;
      case 'watermark':
        return <WatermarkPdfTool />;
      case 'protect':
        return <ProtectPdfTool />;
      default:
        return null;
    }
  };

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

  const activeToolConfig = TOOLS_CONFIG.find((t) => t.id === activeTool);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        onGoHome={handleGoHome}
        onOpenLegal={handleOpenLegal}
      />

      {/* Prominent Zero-Server Security Banner */}
      <SecurityBadge variant="banner" />

      {/* When in Admin mode, render the Admin Console view */}
      {isAdminView ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard onBackToApp={handleBackFromAdmin} />
        </main>
      ) : (
        <>
          {/* Tool Navigation Tabs */}
          <Navigation
            activeTool={activeTool}
            onSelectTool={handleSelectTool}
            onGoHome={handleGoHome}
          />

          {/* Main Content Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            {/* VIEW 1: Active Tool View */}
            {activeTool ? (
              <div>
                {/* Active Tool Header Breadcrumb / Return */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handleGoHome}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Tools</span>
                  </button>

                  {activeToolConfig && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Current tool:</span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                        {getToolIcon(activeTool, 'w-3.5 h-3.5')}
                        {activeToolConfig.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Active Tool Interactive Workspace */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 md:p-10 mb-8">
                  {renderToolComponent()}

                  {/* AdSense Placement: Non-intrusive slot below primary tool action */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <AdBanner format="horizontal" />
                  </div>
                </div>

                {/* Quick Switcher: Explore Other Tools */}
                <div className="mt-12 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Explore Other PDF Tools</h3>
                      <p className="text-xs text-slate-500">
                        Switch seamlessly to another client-side utility
                      </p>
                    </div>
                    <button
                      onClick={handleGoHome}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      View All 8 Tools →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TOOLS_CONFIG.filter((tool) => tool.id !== activeTool).map((tool) => {
                      const meta = TOOL_CARDS_METADATA[tool.id];
                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleSelectTool(tool.id)}
                          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <div
                                className={`p-2 rounded-xl transition-colors duration-200 ${meta.iconBg}`}
                              >
                                {getToolIcon(tool.id, 'w-5 h-5')}
                              </div>
                              {tool.badge && (
                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {tool.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {tool.shortDesc}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                            <span>Open Tool</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* VIEW 2: Homepage Overview with All 8 Tools as Clickable Cards */
              <div>
                {/* Hero Section */}
                <section className="text-center max-w-3xl mx-auto pt-4 pb-10 sm:pb-12">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide mb-5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>100% Client-Side In-Browser PDF Suite</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Every PDF Tool You Need.{' '}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                      Zero Server Uploads.
                    </span>
                  </h1>

                  <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Merge, split, rotate, delete pages, watermark, encrypt, and convert PDFs right
                    inside your browser. Your confidential files never touch our servers.
                  </p>

                  {/* Trust Highlights */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Zero Uploads (100% Private)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-2xs">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Instant Local Processing</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-2xs">
                      <HardDrive className="w-4 h-4 text-indigo-500" />
                      <span>No File Size Limits</span>
                    </div>
                  </div>
                </section>

                {/* Prominent 8 Tools Grid Section */}
                <section className="mb-14">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Choose a PDF Tool
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Select any of our 8 browser utilities to launch the tool immediately.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 mt-2 sm:mt-0">
                      8 Powerful Tools Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TOOLS_CONFIG.map((tool) => {
                      const meta = TOOL_CARDS_METADATA[tool.id];
                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleSelectTool(tool.id)}
                          className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-xl hover:border-indigo-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Top: Icon & Badge */}
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
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                  {meta.tag}
                                </span>
                              )}
                            </div>

                            {/* Card Content: Title & Description */}
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {tool.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                              {tool.shortDesc}
                            </p>
                          </div>

                          {/* Card Footer: Action Button */}
                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                            <span>Launch Tool</span>
                            <div className="w-7 h-7 rounded-full bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Ad Placement: Standard responsive banner */}
                <div className="my-10">
                  <AdBanner format="horizontal" />
                </div>

                {/* Zero-Server Privacy Architecture Guarantee Section */}
                <section className="bg-linear-to-b from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-lg mb-12">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/60 text-indigo-200 text-xs font-semibold mb-4">
                      <ShieldCheck className="w-4 h-4 text-indigo-300" />
                      <span>Strict Privacy Architecture</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Why In-Browser PDF Processing Matters
                    </h2>

                    <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
                      Most online PDF utilities upload your private documents, invoices, bank
                      statements, and IDs to external cloud servers where they can be logged, stored,
                      or exposed. DocuShield operates with WebAssembly &amp; modern browser APIs: your
                      files are read and modified exclusively inside your computer&apos;s memory.
                    </p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-indigo-800/60">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Zero Network Traffic
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          No file payloads are ever transmitted over HTTP/HTTPS POST requests.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" />
                          Instant Output
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          No server conversion queues, download delays, or rate limits.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-indigo-400" />
                          Hostinger Optimized
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          100% static single-page app ready for Hostinger public_html deployment.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </main>
        </>
      )}

      {/* Legal & Compliance Modal (AdSense Required) */}
      <LegalModal
        pageId={legalModalPage}
        onClose={handleCloseLegal}
        onSwitchPage={handleOpenLegal}
      />

      {/* Footer */}
      <Footer onOpenLegal={handleOpenLegal} onOpenAdmin={handleOpenAdmin} />
    </div>
  );
};

export default App;
