import React, { useState } from 'react';
import { NoteItem, filterNotes } from '../utils/notesStorage';
import { Plus, Pin, Trash2, Search, FileText, Sparkles, Tag } from 'lucide-react';

interface NotesSectionProps {
  notes: NoteItem[];
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onTogglePin,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NoteItem['category']>('quick');
  const [newColor, setNewColor] = useState('#6366f1');

  const filteredNotes = filterNotes(notes, search, selectedCategory);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      pinned: false,
      color: newColor,
    });
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const categories = [
    { id: 'all', label: 'All Notes' },
    { id: 'quick', label: 'Quick Memos' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'work', label: 'Work' },
    { id: 'personal', label: 'Personal' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-3 border-b border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
            className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-md shadow-indigo-600/20"
          aria-label="Create new note"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Create Note Modal/Inline Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="mb-4 p-4 rounded-xl bg-slate-950 border border-indigo-500/40 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Create Note</h4>
            <div className="flex items-center gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                aria-label="Select Category"
                className="bg-slate-800 text-xs text-slate-200 rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
              >
                <option value="quick">Quick Memo</option>
                <option value="ideas">Idea</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title..."
            aria-label="Note title"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 mb-2 focus:outline-none focus:border-indigo-500"
          />

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Type your note or bullet points..."
            aria-label="Note content"
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 mb-3 focus:outline-none focus:border-indigo-500 resize-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-xs text-white font-medium hover:bg-indigo-500 shadow"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <FileText className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">No notes found. Tap "New Note" to create one!</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3.5 rounded-xl border transition-all ${
                note.pinned
                  ? 'bg-slate-950/90 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: note.color || '#6366f1' }}
                  />
                  <h4 className="font-semibold text-slate-200 text-sm leading-tight">
                    {note.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onTogglePin(note.id)}
                    aria-label={note.pinned ? "Unpin note" : "Pin note"}
                    className={`p-1.5 rounded-lg transition ${
                      note.pinned
                        ? 'text-indigo-400 bg-indigo-500/10'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    aria-label={`Delete note ${note.title}`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {note.content && (
                <p className="text-xs text-slate-400 line-clamp-3 mb-2 whitespace-pre-wrap">
                  {note.content}
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                <span className="capitalize px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                  {note.category}
                </span>
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
