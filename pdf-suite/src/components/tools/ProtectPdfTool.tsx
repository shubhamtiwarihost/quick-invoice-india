import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Download,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { protectPdf, formatFileSize } from '../../lib/pdf-helpers';
import { downloadFile } from '../../lib/zip-helpers';
import { trackToolStart, trackToolSuccess, trackToolError } from '../../utils/tracker';
import type { ProcessingStatus } from '../../types';

export const ProtectPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [ownerPassword, setOwnerPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    title: '',
  });

  const handleFileSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const selected = selectedFiles[0];
    setFile(selected);

    try {
      const buffer = await selected.arrayBuffer();
      setArrayBuffer(buffer);
    } catch (err) {
      console.error(err);
      alert('Failed to read PDF file.');
      setFile(null);
      setArrayBuffer(null);
    }
  };

  const calculateStrength = (pwd: string): { label: string; score: number; color: string } => {
    if (!pwd) return { label: 'Empty', score: 0, color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { label: 'Weak', score: 1, color: 'bg-rose-500' };
    if (score <= 3) return { label: 'Moderate', score: 2, color: 'bg-amber-500' };
    return { label: 'Strong', score: 3, color: 'bg-emerald-500' };
  };

  const strength = calculateStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleEncrypt = async () => {
    if (!arrayBuffer || !file) return;

    if (!password) {
      alert('Please enter a password to protect the document.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please verify both fields.');
      return;
    }

    const startTime = trackToolStart('protect_pdf');

    setProcessingStatus({
      isProcessing: true,
      title: 'Encrypting PDF document',
      message: 'Generating RC4 128-bit encryption keys and encoding document stream...',
      progress: 20,
    });

    try {
      const encryptedBytes = await protectPdf(
        arrayBuffer,
        password,
        ownerPassword.trim() || undefined
      );

      const baseName = file.name.replace(/\.pdf$/i, '');
      downloadFile(encryptedBytes, `${baseName}_protected.pdf`);

      trackToolSuccess('protect_pdf', {
        startTime,
        pageCount: 1,
        fileCount: 1,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Encryption failed';
      trackToolError('protect_pdf', { startTime, errorMessage: msg });
      alert('Failed to encrypt PDF. Make sure the file is not already password protected.');
    } finally {
      setProcessingStatus({ isProcessing: false, title: '' });
    }
  };

  const resetTool = () => {
    setFile(null);
    setArrayBuffer(null);
    setPassword('');
    setConfirmPassword('');
    setOwnerPassword('');
  };

  return (
    <div className="w-full space-y-6">
      <ProcessingOverlay status={processingStatus} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-600" />
            Protect &amp; Encrypt PDF
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Set a password to lock your PDF with 128-bit encryption. The file can only be opened by authorized recipients.
          </p>
        </div>

        {file && (
          <button
            onClick={resetTool}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Protect Another PDF
          </button>
        )}
      </div>

      {!file ? (
        <DropZone
          accept="pdf"
          multiple={false}
          title="Select a PDF to encrypt with a password"
          subtitle="Encryption occurs 100% inside your browser memory. Your password and document are never sent anywhere."
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* File summary pill */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{file.name}</span>
            </div>
            <span className="text-slate-500 shrink-0">{formatFileSize(file.size)}</span>
          </div>

          {/* Password inputs */}
          <div className="space-y-4">
            {/* User Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Document Open Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        strength.score >= 1 ? strength.color : 'bg-transparent'
                      } w-1/3`}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        strength.score >= 2 ? strength.color : 'bg-transparent'
                      } w-1/3`}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        strength.score >= 3 ? strength.color : 'bg-transparent'
                      } w-1/3`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password to confirm..."
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:ring-2 outline-none transition-all font-mono ${
                  confirmPassword && !passwordsMatch
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match!
                </p>
              )}
            </div>

            {/* Optional Owner Password */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                {showAdvanced ? '− Hide Advanced Options' : '+ Show Advanced Security Options (Owner Password)'}
              </button>

              {showAdvanced && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Owner Password (Optional)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Used to restrict document permissions and password changes.
                  </p>
                  <input
                    type="password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="Optional master / permissions password"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 outline-none bg-white font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Guarantee pill */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your password never touches a network wire. Standard 128-bit RC4 PDF encryption is computed directly on your device.
            </span>
          </div>

          {/* Action button */}
          <button
            onClick={handleEncrypt}
            disabled={!passwordsMatch}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            Encrypt &amp; Download Protected PDF
          </button>
        </div>
      )}
    </div>
  );
};
