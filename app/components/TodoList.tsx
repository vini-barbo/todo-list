'use client';

import { useState } from 'react';
import { Todo } from '@/lib/types/todo';
import FilterTabs, { FilterType } from './FilterTabs';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

interface TodoListProps {
  initialTodos: Todo[];
  isReadOnly: boolean;
}

export default function TodoList({ initialTodos, isReadOnly }: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const todos = initialTodos;

  const handleUpdate = () => {
    // Trigger a page reload to fetch fresh data
    window.location.reload();
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    pending: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  // Empty states based on filter
  const getEmptyState = () => {
    if (filter === 'all') {
      return {
        title: 'No tasks yet',
        description: 'Create the first one',
      };
    }
    if (filter === 'pending') {
      return {
        title: 'No pending tasks',
        description: 'Good work!',
      };
    }
    return {
      title: 'No completed tasks yet',
      description: 'Complete a task to see it here',
    };
  };

  const emptyState = getEmptyState();

  return (
    <div className="space-y-6">
      {/* Header with counter */}
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold text-gray-900">TODO List</h1>
        <span className="text-sm text-gray-600">
          {counts.pending} pending {counts.pending === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Filter Tabs */}
      <FilterTabs
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />

      {/* Task List or Empty State */}
      {filteredTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-sm">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {emptyState.title}
            </h3>
            <p className="text-sm text-gray-600">{emptyState.description}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3" role="list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdate}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      )}

      {/* Add Task FAB */}
      <TodoForm onSuccess={handleUpdate} isReadOnly={isReadOnly} />
    </div>
  );
}
