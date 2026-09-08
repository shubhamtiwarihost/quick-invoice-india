import React from 'react';
import { ShieldCheck, HardDrive, Cpu, CheckCircle2, Lock, Heart } from 'lucide-react';
import type { LegalPageId } from '../legal/legalContent';
import { AdBanner } from '../ads/AdBanner';

interface FooterProps {
  onOpenLegal: (pageId: LegalPageId) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200">
      {/* Footer Top Ad Placement (CLS Safe) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <AdBanner format="horizontal" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Privacy Promise */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Zero-Knowledge Guarantee</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike other online PDF converters that upload your documents to cloud servers, SwiftGST PDF executes directly inside your browser.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero network POST requests</span>
            </div>
          </div>

          {/* Col 2: High Performance Engine */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>Modern Web Technology</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by standard industry engines compiled for modern web standards: <strong>pdf-lib</strong>, <strong>pdfjs-dist</strong>, <strong>jsPDF</strong>, and <strong>JSZip</strong>.
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Pure static SPA • No Node.js runtime required
            </p>
          </div>

          {/* Col 3: Deployment & Hostinger ready */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <HardDrive className="w-5 h-5 text-indigo-600" />
              <span>Deployable Anywhere</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configured with relative asset bundling (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">base: &apos;./&apos;</code>) and optimized Apache <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">.htaccess</code> for shared hosting.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
              <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Hostinger public_html ready</span>
            </div>
          </div>

          {/* Col 4: Legal & Compliance (Required for AdSense & Trust) */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="text-sm font-bold text-slate-900">Legal &amp; Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
                >
                  Privacy &amp; Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('about')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
                >
                  About Our Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('contact')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
                >
                  Contact Us &amp; Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Legal Line */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SwiftGST PDF Tools. In-browser document processing.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal('contact')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
