import React from 'react';
import { ShieldCheck, Lock, Cpu } from 'lucide-react';

interface SecurityBadgeProps {
  variant?: 'compact' | 'full' | 'banner';
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ variant = 'compact' }) => {
  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>100% Secure &amp; Private — Files never leave your browser</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="w-full bg-linear-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 border-y border-emerald-200/60 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-950 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-800">Zero Server Data Leakage:</span>
            <span>All operations execute 100% in your device&apos;s memory via Web APIs.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 text-xs font-mono">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> End-to-End Local
            </span>
            <span className="inline-flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-600" /> Client-Side WebAssembly
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">100% Client-Side Guarantee</h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
          Your files are processed strictly within your browser&apos;s RAM using Web APIs, Web Workers, and WebAssembly. No files, logs, or metadata are ever transmitted to any remote server or third-party service.
        </p>
      </div>
    </div>
  );
};
