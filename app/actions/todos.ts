'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase/server';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return 'Title is required';
  }
  if (trimmed.length > 200) {
    return 'Title must be 1-200 characters';
  }
  return null;
}

function validateDescription(description?: string): string | null {
  if (description && description.length > 1000) {
    return 'Description must be 1000 characters or less';
  }
  return null;
}

export async function createTodo(title: string, description?: string) {
  // Validate BR-10
  const titleError = validateTitle(title);
  if (titleError) {
    return { error: titleError };
  }

  const descError = validateDescription(description);
  if (descError) {
    return { error: descError };
  }

  if (USE_MOCK) {
    return { error: 'Cannot create todos in mock mode' };
  }

  try {
    const { data, error } = await supabase
      .from('todos')
      .insert({
        title: title.trim(),
        description: description || null,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to create todo:', error);
    return { error: 'Failed to create todo' };
  }
}

export async function updateTodo(
  id: string,
  title: string,
  description?: string
) {
  // Validate BR-10
  const titleError = validateTitle(title);
  if (titleError) {
    return { error: titleError };
  }

  const descError = validateDescription(description);
  if (descError) {
    return { error: descError };
  }

  if (USE_MOCK) {
    return { error: 'Cannot update todos in mock mode' };
  }

  try {
    const { error } = await supabase
      .from('todos')
      .update({
        title: title.trim(),
        description: description || null,
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update todo:', error);
    return { error: 'Failed to update todo' };
  }
}

export async function toggleComplete(id: string, completed: boolean) {
  if (USE_MOCK) {
    return { error: 'Cannot update todos in mock mode' };
  }

  try {
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle todo:', error);
    return { error: 'Failed to toggle todo' };
  }
}

export async function deleteTodo(id: string) {
  if (USE_MOCK) {
    return { error: 'Cannot delete todos in mock mode' };
  }

  try {
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) throw error;

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return { error: 'Failed to delete todo' };
  }
}
