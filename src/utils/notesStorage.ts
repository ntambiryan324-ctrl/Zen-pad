export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: 'work' | 'personal' | 'ideas' | 'quick';
  pinned: boolean;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export function filterNotes(
  notes: NoteItem[],
  query: string,
  categoryFilter: string | 'all'
): NoteItem[] {
  const cleanQuery = query.trim().toLowerCase();
  return notes
    .filter((note) => {
      const matchesCategory =
        categoryFilter === 'all' || note.category === categoryFilter;
      const matchesQuery =
        !cleanQuery ||
        note.title.toLowerCase().includes(cleanQuery) ||
        note.content.toLowerCase().includes(cleanQuery);
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
}

export function toggleTaskStatus(tasks: TaskItem[], taskId: string): TaskItem[] {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
}

export function calculateStats(notes: NoteItem[], tasks: TaskItem[]) {
  const totalNotes = notes.length;
  const pinnedNotes = notes.filter((n) => n.pinned).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalNotes,
    pinnedNotes,
    totalTasks,
    completedTasks,
    completionRate,
  };
}
