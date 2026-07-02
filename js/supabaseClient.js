import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// TODO: paste your Supabase project's "Project URL" and "anon public" key here
// (Dashboard -> Settings -> API). These are safe to expose publicly — access
// control is enforced server-side by Postgres Row Level Security, not by
// keeping this key secret. See README.md for the full setup walkthrough.
const SUPABASE_URL = 'https://tdgicpgwnobiwhbkgzsp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkZ2ljcGd3bm9iaXdoYmtnenNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjQ1MDIsImV4cCI6MjA5ODU0MDUwMn0.Gt2DCDKoSbtnl_dMdlHPYQ3gRxVs2cEyWhtSbhTXYD8';

export const isConfigured =
  !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR-ANON');

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
