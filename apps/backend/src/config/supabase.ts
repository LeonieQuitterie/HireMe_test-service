// apps/backend/src/config/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Lấy URL
const supabaseUrl = process.env.SUPABASE_URL?.trim();
if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is missing in .env');
}

// ƯU TIÊN 1: Dùng service_role key (dev local – bypass RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

// ƯU TIÊN 2: Nếu không có service key thì dùng anon key (production)
const supabaseKey = supabaseServiceKey || process.env.SUPABASE_ANON_KEY?.trim();

if (!supabaseKey) {
  throw new Error(
    'Missing Supabase key! You need either:\n' +
    '• SUPABASE_SERVICE_ROLE_KEY (for local dev - recommended)\n' +
    '• SUPABASE_ANON_KEY (for production)'
  );
}

console.log('Supabase client initialized with:', supabaseServiceKey ? 'SERVICE_ROLE key (bypass RLS)' : 'ANON key');

// Client chính dùng trong backend
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Optional: client anon riêng (nếu cần test RLS sau này)
export const getSupabaseAnonClient = () => {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) throw new Error('Missing anon key');
  return createClient(url, key);
};