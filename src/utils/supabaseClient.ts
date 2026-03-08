import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

// Create a single Supabase client for direct database queries
// This bypasses the Edge Function and queries Supabase directly
export const supabaseClient = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
