import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, CheckCircle2, HelpCircle, Smartphone, Tablet, Share2, PlusSquare, ArrowRight, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  const handleInstallClick = async () => {
    if (isInstallable) {
      try {
        const success = await install();
        if (success) {
          setInstallStatus('Installed successfully!');
        } else {
          setInstallStatus('Installation was dismissed.');
        }
      } catch (err) {
        console.error('Install prompt error:', err);
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-4 h-4" />
        <span>Installed App Mode</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install ZenPad Touch to Tablet Home Screen"
        className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
      >
        <Download className="w-4 h-4 animate-bounce group-hover:scale-110 transition-transform" />
        <span>Install App</span>
        {isInstallable && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        )}
      </button>

      {/* Interactive Install Guide Modal */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto my-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close installation instructions"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Tablet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Install ZenPad on your Tablet</h3>
                <p className="text-xs text-slate-400">Turn this into an icon on your home screen with offline access</p>
              </div>
            </div>

            {/* Direct install trigger if available */}
            {isInstallable ? (
              <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <p className="text-sm text-indigo-200 mb-3">
                  Your browser supports 1-tap installation!
                </p>
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  Tap Here to Confirm Install
                </button>
              </div>
            ) : null}

            <div className="space-y-4">
              {/* Android tablet steps */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-2">
                  <Smartphone className="w-4 h-4" />
                  <span>On Android Tablets (Chrome, Edge, Samsung Internet):</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1">
                  <li>
                    Tap the <strong>three dots (⋮)</strong> menu in your browser's top right corner.
                  </li>
                  <li>
                    Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    Confirm <strong>"Install"</strong> when prompted. The ZenPad icon will appear on your tablet home screen!
                  </li>
                </ol>
              </div>

              {/* iPad / iOS Safari steps */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-2">
                  <Tablet className="w-4 h-4" />
                  <span>On iPad (Safari):</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1">
                  <li className="flex items-center gap-1.5 flex-wrap">
                    <span>1. Tap the</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 text-[11px]">
                      <Share2 className="w-3 h-3" /> Share
                    </span>
                    <span>button in the Safari toolbar.</span>
                  </li>
                  <li className="flex items-center gap-1.5 flex-wrap">
                    <span>2. Scroll down and tap</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 text-[11px]">
                      <PlusSquare className="w-3 h-3" /> Add to Home Screen
                    </span>.
                  </li>
                  <li>3. Tap <strong>Add</strong> in the top right corner.</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
