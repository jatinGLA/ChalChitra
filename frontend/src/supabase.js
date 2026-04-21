// ============================================
// SUPABASE CLIENT CONFIGURATION (FRONTEND)
// ============================================
// Frontend Supabase client initialization
// Used for authentication and real-time database queries
// Note: Uses anonymous key for client-side access

import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment variables
// These are prefixed with VITE_ to be exposed to the frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize and export Supabase client instance
// This client is used throughout the app for database operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
