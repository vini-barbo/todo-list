'use client';

import { useState } from 'react';
import { Todo } from '@/lib/types/todo';
import { updateTodo, toggleComplete, deleteTodo } from '@/app/actions/todos';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
  isReadOnly: boolean;
}

export default function TodoItem({ todo, onUpdate, isReadOnly }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggle = async () => {
    if (isReadOnly || isProcessing) return;
    
    setIsProcessing(true);
    const result = await toggleComplete(todo.id, !todo.completed);
    setIsProcessing(false);

    if (result.error) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
    } else {
      onUpdate();
    }
  };

  const handleSave = async () => {
    if (isReadOnly || isProcessing) return;

    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }
    if (trimmedTitle.length > 200) {
      setError('Title must be 1-200 characters');
      return;
    }

    setIsProcessing(true);
    const result = await updateTodo(todo.id, trimmedTitle, editDescription);
    setIsProcessing(false);

    if (result.error) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
    } else {
      setIsEditing(false);
      setError(null);
      onUpdate();
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (isReadOnly || isProcessing) return;

    setIsProcessing(true);
    const result = await deleteTodo(todo.id);
    setIsProcessing(false);

    if (result.error) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
      setShowDeleteConfirm(false);
    } else {
      onUpdate();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        todo.completed ? 'opacity-60' : 'opacity-100'
      }`}>
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={isReadOnly || isProcessing}
            className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            {todo.completed && (
              <svg className="w-full h-full text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title"
                  autoFocus
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Description (optional)"
                  rows={2}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isProcessing}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isProcessing}
                    className="px-3 py-1 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isReadOnly && setIsEditing(true)}
                className={`cursor-pointer ${isReadOnly ? 'cursor-default' : ''}`}
              >
                <h3
                  className={`text-base font-medium ${
                    todo.completed
                      ? 'line-through text-gray-500'
                      : 'text-gray-900'
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`mt-1 text-sm ${
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {todo.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex gap-2">
              {!isReadOnly && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-label="Edit task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isProcessing}
                    className="p-2.5 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50"
                    aria-label="Delete task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        {error && !isEditing && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Delete Task</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete &quot;{todo.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isProcessing ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
