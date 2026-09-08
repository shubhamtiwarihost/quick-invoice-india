import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import type { ProcessingStatus } from '../../types';

interface ProcessingOverlayProps {
  status: ProcessingStatus;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ status }) => {
  if (!status.isProcessing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-100 flex flex-col items-center text-center">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900">{status.title}</h3>
        <p className="text-sm text-slate-600 mt-1 max-w-xs leading-relaxed">
          {status.message || 'Processing your documents securely inside browser memory...'}
        </p>

        {status.progress !== undefined && (
          <div className="w-full mt-6">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
              <span>Progress</span>
              <span>{Math.round(status.progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, status.progress))}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No network uploads • 100% In-Memory</span>
        </div>
      </div>
    </div>
  );
};
