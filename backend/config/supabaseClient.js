// ============================================
// SUPABASE DATABASE CLIENT CONFIGURATION
// ============================================
// This file initializes and exports the Supabase client
// used for all database operations throughout the backend

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Retrieve Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Initialize Supabase client
let supabase = null;

// Check if required credentials are present
if (supabaseUrl && supabaseKey) {
  // Create Supabase client instance for database operations
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized');
} else {
  // Warning if credentials are missing - database operations will fail
  console.warn('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env. Supabase client could not be initialized.');
}

// Export the Supabase client for use in controllers and services
export default supabase;
