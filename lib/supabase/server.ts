import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0MjU0MTIwMCwiZXhwIjoxOTU4MTE3MjAwfQ.placeholder';

const hasRealCredentials = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key-here';

if (!hasRealCredentials) {
  console.warn('Using mock mode - Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
export const isSupabaseConfigured = hasRealCredentials;
