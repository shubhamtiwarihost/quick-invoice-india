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
        <span>Secure &amp; Private — Files stay in your browser</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return null;
  }

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Browser Privacy Guarantee</h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
          Your files are processed strictly within your browser&apos;s RAM using Web APIs, Web Workers, and WebAssembly. No files, logs, or metadata are ever transmitted to any remote server or third-party service.
        </p>
      </div>
    </div>
  );
};
