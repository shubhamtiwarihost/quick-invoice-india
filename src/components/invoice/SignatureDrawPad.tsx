"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Upload, PenTool, RotateCcw } from "lucide-react";

export function SignatureDrawPad({
  value,
  onChange,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "draw">("upload");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize canvas context
  useEffect(() => {
    if (mode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#0f172a";
  }, [mode]);

  function getCoordinates(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function startDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  }

  function stopDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture release ignore
      }
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }

  function applyDrawnSignature() {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL("image/png");
    onChange(dataUrl);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result || ""));
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:col-span-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-700">Authorized Signature</span>
        {/* Mode Tabs */}
        <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              mode === "upload"
                ? "bg-white font-medium text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Upload className="h-3 w-3" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("draw")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              mode === "draw"
                ? "bg-white font-medium text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <PenTool className="h-3 w-3" />
            Draw
          </button>
        </div>
      </div>

      {/* Upload Mode */}
      {mode === "upload" ? (
        <div className="mt-3">
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-teal-700 hover:file:bg-teal-100"
            />
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="shrink-0 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        /* Draw Mode */
        <div className="mt-3 space-y-2">
          <div className="relative rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50">
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              className="h-28 w-full touch-none cursor-crosshair rounded-lg"
            />
            {!hasDrawn && !isDrawing && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                Draw your signature here with mouse or touch
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={clearCanvas}
              disabled={!hasDrawn}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </button>
            <button
              type="button"
              onClick={applyDrawnSignature}
              disabled={!hasDrawn}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-40"
            >
              <Check className="h-3 w-3" />
              Apply Signature
            </button>
          </div>
        </div>
      )}

      {/* Active Signature Preview */}
      {value ? (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Active signature:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Signature preview"
              className="h-8 max-w-[120px] object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-600 hover:underline"
          >
            Clear signature
          </button>
        </div>
      ) : null}
    </div>
  );
}
