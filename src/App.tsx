/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineBanner } from './components/OfflineBanner';
import { DoodleCanvas } from './components/DoodleCanvas';
import { NotesSection } from './components/NotesSection';
import { TasksSection } from './components/TasksSection';
import { TabletDiagnosticsModal } from './components/TabletDiagnosticsModal';
import { NoteItem, TaskItem, calculateStats, toggleTaskStatus } from './utils/notesStorage';
import {
  Tablet,
  Maximize2,
  Minimize2,
  Sliders,
  CheckCircle2,
  PenTool,
  FileText,
  LayoutGrid,
  Sparkles,
  Layers,
} from 'lucide-react';

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Welcome to ZenPad Touch! 🎉',
    content:
      'This app is built to test Progressive Web App (PWA) installation directly on your tablet.\n\n• Tap "Install App" in the top bar to test installing it directly to your home screen.\n• Draw with your finger or stylus on the scratchpad.\n• Works 100% offline with zero PC required!',
    category: 'quick',
    pinned: true,
    color: '#818cf8',
    createdAt: Date.now() - 100000,
    updatedAt: Date.now(),
  },
  {
    id: 'note-2',
    title: 'Why PWA is best for tablets 📱',
    content:
      '1. No need to download 80MB APK files\n2. Directly launches in standalone fullscreen without browser bars\n3. Instant updates whenever new features are added\n4. Uses zero PC tools or Android Studio setup',
    category: 'ideas',
    pinned: false,
    color: '#34d399',
    createdAt: Date.now() - 50000,
    updatedAt: Date.now() - 50000,
  },
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    text: 'Click the "Install App" button in the header',
    completed: false,
    priority: 'high',
    createdAt: Date.now() - 80000,
  },
  {
    id: 'task-2',
    text: 'Add to tablet Home Screen and open from the new icon',
    completed: false,
    priority: 'high',
    createdAt: Date.now() - 70000,
  },
  {
    id: 'task-3',
    text: 'Try doodling on the scratchpad with touch',
    completed: true,
    priority: 'medium',
    createdAt: Date.now() - 60000,
  },
  {
    id: 'task-4',
    text: 'Test toggling WiFi off to see offline caching in action',
    completed: false,
    priority: 'low',
    createdAt: Date.now() - 50000,
  },
];

export default function App() {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('zenpad_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('zenpad_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [activeTab, setActiveTab] = useState<'split' | 'notes' | 'canvas' | 'tasks'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('zenpad_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('zenpad_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const stats = calculateStats(notes, tasks);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleAddNote = (newNoteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: NoteItem = {
      ...newNoteData,
      id: `note-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n))
    );
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => toggleTaskStatus(prev, id));
  };

  const handleAddTask = (text: string, priority: TaskItem['priority']) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Tablet App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Tablet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  ZenPad Touch
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  PWA Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Touch-first tablet notes, tasks & scratchpad
              </p>
            </div>
          </div>

          {/* Quick Tablet Stats (scannable) */}
          <div className="hidden md:flex items-center gap-4 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Notes:</span>
              <span className="font-semibold text-slate-200">{stats.totalNotes}</span>
            </div>
            <div className="w-px h-3 bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Tasks:</span>
              <span className="font-semibold text-slate-200">
                {stats.completedTasks}/{stats.totalTasks}
              </span>
            </div>
          </div>

          {/* Right Action Tools: Fullscreen, Diagnostics, and PWA Install */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowDiagnostics(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Tablet & PWA Diagnostics"
              aria-label="Tablet and PWA diagnostics"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>
        </div>

        {/* Tablet View Selector Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-1 mt-3 pt-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeTab === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Split Tablet View</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes ({stats.totalNotes})</span>
          </button>

          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeTab === 'canvas'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Scratchpad Doodle</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Focus Tasks ({stats.completedTasks}/{stats.totalTasks})</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-170px)] min-h-[550px]">
            {/* Left Column: Notes (5 cols) */}
            <div className="lg:col-span-5 h-full">
              <NotesSection
                notes={notes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            </div>

            {/* Right Column: Scratchpad & Tasks (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6 h-full">
              <div className="flex-1 min-h-[300px]">
                <DoodleCanvas />
              </div>
              <div className="h-64">
                <TasksSection
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="h-[calc(100vh-170px)] min-h-[500px]">
            <NotesSection
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onTogglePin={handleTogglePin}
            />
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className="h-[calc(100vh-170px)] min-h-[500px]">
            <DoodleCanvas />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="h-[calc(100vh-170px)] min-h-[500px] max-w-2xl mx-auto">
            <TasksSection
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}
      </main>

      {/* Offline banner notification */}
      <OfflineBanner />

      {/* Tablet Diagnostics Modal */}
      <TabletDiagnosticsModal
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
      />
    </div>
  );
}
