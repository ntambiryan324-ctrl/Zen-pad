import React, { useState } from 'react';
import { TaskItem, toggleTaskStatus } from '../utils/notesStorage';
import { CheckSquare, Square, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface TasksSectionProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (text: string, priority: TaskItem['priority']) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [newText, setNewText] = useState('');
  const [priority, setPriority] = useState<TaskItem['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddTask(newText.trim(), priority);
    setNewText('');
  };

  const priorityColors = {
    low: 'text-slate-400 border-slate-700 bg-slate-800/40',
    medium: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    high: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Focus Checklist</h3>
        </div>
        <span className="text-xs text-slate-400">
          {tasks.filter((t) => t.completed).length} / {tasks.length} done
        </span>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 my-3">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add task to your checklist..."
          aria-label="New task description"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          aria-label="Task priority"
          className="bg-slate-950 border border-slate-800 rounded-xl px-2 text-xs text-slate-300 focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center shadow"
          aria-label="Add task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-xs">
            No tasks yet. Add your daily goals!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer select-none ${
                task.completed
                  ? 'bg-slate-950/40 border-slate-900 opacity-60'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  type="button"
                  aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
                  className="text-indigo-400 focus:outline-none"
                >
                  {task.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                <span
                  className={`text-xs text-slate-200 truncate ${
                    task.completed ? 'line-through text-slate-500' : ''
                  }`}
                >
                  {task.text}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border ${
                    priorityColors[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  aria-label={`Delete task ${task.text}`}
                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
