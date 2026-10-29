import React, { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, Undo2, Download, PenTool, Eraser } from 'lucide-react';

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
}

export const DoodleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#818cf8');
  const [brushSize, setBrushSize] = useState(4);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  const colors = [
    { name: 'Indigo', value: '#818cf8' },
    { name: 'Emerald', value: '#34d399' },
    { name: 'Amber', value: '#fbbf24' },
    { name: 'Rose', value: '#fb7185' },
    { name: 'White', value: '#ffffff' },
    { name: 'Eraser', value: '#0f172a' },
  ];

  // Resize canvas according to container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      redrawCanvas();
    }
  }, []);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [strokes]);

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const pos = getCanvasPos(e);
    currentStrokeRef.current = [pos];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getCanvasPos(e);
    currentStrokeRef.current.push(pos);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStrokeRef.current.length > 1) {
      setStrokes((prev) => [
        ...prev,
        {
          points: [...currentStrokeRef.current],
          color,
          size: brushSize,
        },
      ]);
    }
    currentStrokeRef.current = [];
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `zenpad-sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
      {/* Canvas Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <PenTool className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Touch Scratchpad / Stylus Doodle</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Touch Ready
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Colors */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.value)}
                aria-label={`Select color ${c.name}`}
                className={`w-6 h-6 rounded-lg transition-transform ${
                  color === c.value ? 'scale-110 ring-2 ring-indigo-400' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>

          {/* Stroke size */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {[2, 5, 10].map((sz) => (
              <button
                key={sz}
                onClick={() => setBrushSize(sz)}
                className={`px-2 py-1 text-xs rounded-lg font-medium transition ${
                  brushSize === sz ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sz === 2 ? 'S' : sz === 5 ? 'M' : 'L'}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={strokes.length === 0}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Undo stroke"
              aria-label="Undo stroke"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              disabled={strokes.length === 0}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Clear scratchpad"
              aria-label="Clear scratchpad"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 transition"
              title="Save doodle image"
              aria-label="Download doodle"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawing Surface */}
      <div className="relative flex-1 min-h-[320px] mt-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          className="w-full h-full cursor-crosshair"
        />
        {strokes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-600">
            <PenTool className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">Draw or write here with your finger or tablet pen</p>
          </div>
        )}
      </div>
    </div>
  );
};
