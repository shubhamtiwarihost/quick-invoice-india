import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, TOOLS_CONFIG } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { SecurityBadge } from './components/common/SecurityBadge';
import { AdBanner } from './components/ads/AdBanner';
import { LegalModal } from './components/legal/LegalModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Home } from './components/home/Home';
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
  Sparkles,
} from 'lucide-react';

const VALID_TOOLS: PdfToolId[] = [
  'merge',
  'split',
  'rotate',
  'delete',
  'images-to-pdf',
  'pdf-to-images',
  'watermark',
  'protect',
];

const getAppBasePath = (): string => {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname.toLowerCase();
  if (pathname.startsWith('/pdf-tools')) return '/pdf-tools';
  if (pathname.startsWith('/tools')) return '/tools';
  return '';
};

const parseCurrentLocation = (): {
  tool: PdfToolId | null;
  isAdmin: boolean;
  legal: LegalPageId | null;
} => {
  if (typeof window === 'undefined') {
    return { tool: null, isAdmin: false, legal: null };
  }

  const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const pathname = rawPath.replace(/^pdf-tools\/?/, '').replace(/^tools\/?/, '');
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();

  // 1. Admin route checks
  if (pathname === 'admin' || hash === 'admin') {
    return { tool: null, isAdmin: true, legal: null };
  }

  // 2. Legal pages check
  const legalPages: LegalPageId[] = ['privacy', 'terms', 'about', 'contact'];
  if (legalPages.includes(pathname as LegalPageId)) {
    return { tool: null, isAdmin: false, legal: pathname as LegalPageId };
  }
  if (legalPages.includes(hash as LegalPageId)) {
    return { tool: null, isAdmin: false, legal: hash as LegalPageId };
  }

  // 3. Direct tool sub-routes (both pathname e.g. /merge and hash e.g. #merge)
  if (VALID_TOOLS.includes(pathname as PdfToolId)) {
    return { tool: pathname as PdfToolId, isAdmin: false, legal: null };
  }
  if (VALID_TOOLS.includes(hash as PdfToolId)) {
    return { tool: hash as PdfToolId, isAdmin: false, legal: null };
  }

  // Common route aliases
  if (pathname === 'split-extract' || hash === 'split-extract' || pathname === 'extract' || hash === 'extract') {
    return { tool: 'split', isAdmin: false, legal: null };
  }
  if (pathname === 'images' || hash === 'images' || pathname === 'img-to-pdf' || hash === 'img-to-pdf') {
    return { tool: 'images-to-pdf', isAdmin: false, legal: null };
  }
  if (pathname === 'pdf-to-image' || hash === 'pdf-to-image' || pathname === 'pdf2img' || hash === 'pdf2img') {
    return { tool: 'pdf-to-images', isAdmin: false, legal: null };
  }

  // Default to Homepage with All 8 Tools Grid
  return { tool: null, isAdmin: false, legal: null };
};

export const App: React.FC = () => {
  const initialRoute = parseCurrentLocation();
  const [activeTool, setActiveTool] = useState<PdfToolId | null>(initialRoute.tool);
  const [isAdminView, setIsAdminView] = useState<boolean>(initialRoute.isAdmin);
  const [legalModalPage, setLegalModalPage] = useState<LegalPageId | null>(initialRoute.legal);

  // Initialize analytics on boot
  useEffect(() => {
    initAnalytics();
  }, []);

  // Listen to browser navigation (back / forward / hash change)
  useEffect(() => {
    const handleLocationChange = () => {
      const { tool, isAdmin, legal } = parseCurrentLocation();
      setActiveTool(tool);
      setIsAdminView(isAdmin);
      setLegalModalPage(legal);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Navigation handlers with clean URL sub-route updates
  const handleSelectTool = useCallback((id: PdfToolId) => {
    setIsAdminView(false);
    setActiveTool(id);
    const basePath = getAppBasePath();
    const newUrl = basePath ? `${basePath}/${id}` : `/${id}`;
    try {
      window.history.pushState(null, '', newUrl);
    } catch {
      window.location.hash = id;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGoHome = useCallback(() => {
    setIsAdminView(false);
    setActiveTool(null);
    const basePath = getAppBasePath();
    const newUrl = basePath ? `${basePath}/` : '/';
    try {
      window.history.pushState(null, '', newUrl);
    } catch {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenAdmin = useCallback(() => {
    setIsAdminView(true);
    setActiveTool(null);
    try {
      window.history.pushState(null, '', '/admin');
    } catch {
      window.location.hash = 'admin';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenLegal = useCallback((pageId: LegalPageId) => {
    setLegalModalPage(pageId);
    try {
      window.history.pushState(null, '', `/${pageId}`);
    } catch {
      window.location.hash = pageId;
    }
  }, []);

  const handleCloseLegal = useCallback(() => {
    setLegalModalPage(null);
    if (activeTool) {
      try {
        window.history.pushState(null, '', `/${activeTool}`);
      } catch {
        window.location.hash = activeTool;
      }
    } else if (isAdminView) {
      try {
        window.history.pushState(null, '', '/admin');
      } catch {
        window.location.hash = 'admin';
      }
    } else {
      try {
        window.history.pushState(null, '', '/');
      } catch {
        window.location.hash = '';
      }
    }
  }, [activeTool, isAdminView]);

  // Main tool renderer
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

  const getToolIcon = (id: PdfToolId, className = 'w-5 h-5') => {
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
      {/* 1. Header with Tools Dropdown & Admin Navigation */}
      <Header
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        onGoHome={handleGoHome}
        onOpenLegal={handleOpenLegal}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 2. Main Body View Routing */}
      {isAdminView ? (
        /* VIEW A: Admin Telemetry Dashboard */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard onBackToApp={handleGoHome} />
        </main>
      ) : activeTool ? (
        /* VIEW B: Active PDF Tool Workspace */
        <>
          {/* Quick Tool Switcher Navigation Tabs */}
          <Navigation
            activeTool={activeTool}
            onSelectTool={handleSelectTool}
            onGoHome={handleGoHome}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Breadcrumb / Return to All Tools */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <button
                onClick={handleGoHome}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Tools</span>
              </button>

              {activeToolConfig && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Current Utility:</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-2xs">
                    {getToolIcon(activeTool, 'w-3.5 h-3.5 text-indigo-600')}
                    <span>{activeToolConfig.title}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Tool Container */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 md:p-10 mb-8">
              {renderToolComponent()}

              {/* Ad Placement: Safe horizontal slot below main tool action */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <AdBanner format="horizontal" />
              </div>
            </div>

            {/* Quick Switcher: Explore Other Tools */}
            <div className="mt-12 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Explore Other PDF Tools</h3>
                </div>
                <button
                  onClick={handleGoHome}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  View All 8 Tools →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TOOLS_CONFIG.filter((t) => t.id !== activeTool).map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handleSelectTool(tool.id)}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 transition-colors">
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
                ))}
              </div>
            </div>
          </main>
        </>
      ) : (
        /* VIEW C: Main Landing Page with All 8 Tools Grid Front and Center */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <Home
            onSelectTool={handleSelectTool}
            onOpenLegal={handleOpenLegal}
            onOpenAdmin={handleOpenAdmin}
          />
        </main>
      )}

      {/* 4. Legal Compliance Modal */}
      <LegalModal
        pageId={legalModalPage}
        onClose={handleCloseLegal}
        onSwitchPage={handleOpenLegal}
      />

      {/* 5. Footer with AdSense Slot and Architecture Info */}
      <Footer onOpenLegal={handleOpenLegal} onOpenAdmin={handleOpenAdmin} />
    </div>
  );
};

export default App;
