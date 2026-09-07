import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, TOOLS_CONFIG } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { SecurityBadge } from './components/common/SecurityBadge';
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
  ShieldCheck,
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<PdfToolId>('merge');

  const renderTool = () => {
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
        return <MergePdfTool />;
    }
  };

  const getToolIcon = (id: PdfToolId) => {
    const props = { className: 'w-5 h-5 text-indigo-600' };
    switch (id) {
      case 'merge':
        return <Layers {...props} />;
      case 'split':
        return <Scissors {...props} />;
      case 'rotate':
        return <RotateCw {...props} />;
      case 'delete':
        return <Trash2 {...props} />;
      case 'images-to-pdf':
        return <Image {...props} />;
      case 'pdf-to-images':
        return <Images {...props} />;
      case 'watermark':
        return <Stamp {...props} />;
      case 'protect':
        return <Lock {...props} />;
      default:
        return <Layers {...props} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header activeTool={activeTool} onSelectTool={setActiveTool} />

      {/* Prominent Zero-Server Security Banner */}
      <SecurityBadge variant="banner" />

      {/* Tool Navigation Tabs */}
      <Navigation activeTool={activeTool} onSelectTool={setActiveTool} />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 md:p-10 mb-10">
          {renderTool()}
        </div>

        {/* Quick Tools Explorer Grid */}
        <div className="mt-8 mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Explore All PDF Utilities</h3>
              <p className="text-xs text-slate-500">Every utility operates 100% in your browser memory.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOOLS_CONFIG.map((tool) => {
              const isCurrent = activeTool === tool.id;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-100/60 transition-colors">
                        {getToolIcon(tool.id)}
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
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {tool.shortDesc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>{isCurrent ? 'Active Tool' : 'Open Tool'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
