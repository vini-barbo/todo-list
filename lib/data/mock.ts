import { Todo } from '@/lib/types/todo';

export const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, and coffee',
    completed: false,
    createdAt: new Date('2026-05-27T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Finish project documentation',
    description: 'Complete the README and API docs',
    completed: false,
    createdAt: new Date('2026-05-27T09:30:00Z'),
  },
  {
    id: '3',
    title: 'Call dentist',
    description: 'Schedule appointment for next week',
    completed: true,
    createdAt: new Date('2026-05-26T14:00:00Z'),
  },
  {
    id: '4',
    title: 'Review pull requests',
    completed: false,
    createdAt: new Date('2026-05-26T11:00:00Z'),
  },
  {
    id: '5',
    title: 'Update dependencies',
    description: 'Run npm audit and update outdated packages',
    completed: true,
    createdAt: new Date('2026-05-25T16:00:00Z'),
  },
];
