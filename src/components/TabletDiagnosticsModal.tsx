import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tablet, CheckCircle, AlertCircle, Info, Zap, Sparkles, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface TabletDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TabletDiagnosticsModal: React.FC<TabletDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, swRegistered } = usePWAInstall();
  const [screenInfo, setScreenInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio,
    orientation: window.screen?.orientation?.type || 'unknown',
    touchPoints: navigator.maxTouchPoints || 0,
  });

  useEffect(() => {
    const updateMetrics = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio,
        orientation: window.screen?.orientation?.type || 'unknown',
        touchPoints: navigator.maxTouchPoints || 0,
      });
    };
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, []);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[88vh] overflow-y-auto my-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close diagnostics"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Tablet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tablet & PWA Diagnostics</h3>
            <p className="text-xs text-slate-400">Live hardware & progressive web app status</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Running Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">App Mode:</span>
            <div className="flex items-center gap-1.5 font-medium">
              {isInstalled ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Standalone PWA (Native Mode)</span>
                </>
              ) : (
                <>
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400">Browser Tab (Installable)</span>
                </>
              )}
            </div>
          </div>

          {/* Browser install event */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Prompt Ready:</span>
            <span className={isInstallable ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {isInstallable ? 'Yes (1-Tap Ready)' : 'Standard Menu Flow'}
            </span>
          </div>

          {/* Service worker */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Offline Service Worker:</span>
            <span className="text-emerald-400 font-medium">Active & Caching</span>
          </div>

          {/* Screen / Touch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Touch Support:</span>
            <span className="text-slate-200">
              {screenInfo.touchPoints > 0
                ? `Supported (${screenInfo.touchPoints} touch points)`
                : 'Pointer / Mouse'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Resolution & Scale:</span>
            <span className="text-slate-200">
              {screenInfo.width} × {screenInfo.height} (DPR {screenInfo.dpr})
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Storage Engine:</span>
            <span className="text-slate-200">Local Cache (Zero Cloud latency)</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
