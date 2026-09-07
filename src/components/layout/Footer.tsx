import React from 'react';
import { ShieldCheck, HardDrive, Cpu, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Privacy Promise */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Zero-Knowledge Architecture</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike other online PDF converters that secretly upload your sensitive tax, financial, and personal records to cloud servers, DocuShield executes 100% inside your browser’s V8 memory.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tested &amp; verified: zero network POST requests</span>
            </div>
          </div>

          {/* Col 2: High Performance Engine */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>Client-Side Engine</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by standard industry engines compiled for modern web standards: <strong>pdf-lib</strong> for binary manipulation, <strong>pdfjs-dist</strong> for canvas rasterization, <strong>jsPDF</strong> for rendering, and <strong>JSZip</strong> for bundling.
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Pure static SPA • No Node.js runtime required on host
            </p>
          </div>

          {/* Col 3: Deployment & Hostinger ready */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <HardDrive className="w-5 h-5 text-indigo-600" />
              <span>Deployable Anywhere</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineered with relative asset bundling (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">base: &apos;./&apos;</code>) and optimized Apache <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">.htaccess</code>. Ready to drag &amp; drop directly into Hostinger <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">public_html</code>.
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} DocuShield PDF. Open client-side software.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
