import { getTodos } from '@/lib/data/todos';
import TodoList from '@/app/components/TodoList';
import OfflineBanner from '@/app/components/OfflineBanner';

export default async function Home() {
  const todos = await getTodos();
  const isReadOnly = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  return (
    <>
      {isReadOnly && <OfflineBanner />}
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <TodoList initialTodos={todos} isReadOnly={isReadOnly} />
        </div>
      </main>
    </>
  );
}
