import { supabase } from '@/lib/supabase/server';
import { Todo } from '@/lib/types/todo';
import { mockTodos } from '@/lib/data/mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function getTodos(): Promise<Todo[]> {
  if (USE_MOCK) {
    return mockTodos;
  }

  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      createdAt: new Date(row.created_at),
    }));
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return [];
  }
}

export async function getTodoById(id: string): Promise<Todo | null> {
  if (USE_MOCK) {
    return mockTodos.find((todo) => todo.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Failed to fetch todo:', error);
    return null;
  }
}
