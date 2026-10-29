import test from 'node:test';
import assert from 'node:assert/strict';
import { filterNotes, toggleTaskStatus, calculateStats, NoteItem, TaskItem } from './notesStorage';

const mockNotes: NoteItem[] = [
  {
    id: '1',
    title: 'Grocery List',
    content: 'Apples, milk, bread',
    category: 'personal',
    pinned: false,
    color: '#6366f1',
    createdAt: 1000,
    updatedAt: 1000,
  },
  {
    id: '2',
    title: 'PWA Architecture',
    content: 'Check manifest, service worker and install banner',
    category: 'work',
    pinned: true,
    color: '#3b82f6',
    createdAt: 2000,
    updatedAt: 2000,
  },
  {
    id: '3',
    title: 'Tablet Idea',
    content: 'Stylus finger drawing on canvas',
    category: 'ideas',
    pinned: false,
    color: '#10b981',
    createdAt: 3000,
    updatedAt: 3000,
  },
];

const mockTasks: TaskItem[] = [
  { id: 't1', text: 'Test PWA install prompt', completed: false, priority: 'high', createdAt: 100 },
  { id: 't2', text: 'Check offline cache', completed: true, priority: 'medium', createdAt: 200 },
];

test('filterNotes filters by query and keeps pinned first', () => {
  const filtered = filterNotes(mockNotes, 'idea', 'all');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, '3');

  const allFiltered = filterNotes(mockNotes, '', 'all');
  assert.equal(allFiltered.length, 3);
  assert.equal(allFiltered[0].id, '2'); // pinned note must be first
});

test('toggleTaskStatus inverts completed state cleanly', () => {
  const updated = toggleTaskStatus(mockTasks, 't1');
  assert.equal(updated.find((t) => t.id === 't1')?.completed, true);

  const toggledBack = toggleTaskStatus(updated, 't1');
  assert.equal(toggledBack.find((t) => t.id === 't1')?.completed, false);
});

test('calculateStats computes valid counts and percentage', () => {
  const stats = calculateStats(mockNotes, mockTasks);
  assert.equal(stats.totalNotes, 3);
  assert.equal(stats.pinnedNotes, 1);
  assert.equal(stats.totalTasks, 2);
  assert.equal(stats.completedTasks, 1);
  assert.equal(stats.completionRate, 50);
});
