import { createClient } from '@supabase/supabase-js';

// TODO: Trage hier deine Supabase-URL und den anon/public Key ein
const supabaseUrl = 'https://sqlnoaaimkrxrkspqtbq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbG5vYWFpbWtyeHJrc3BxdGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NzgyMzAsImV4cCI6MjA3MTI1NDIzMH0.oI201Oqgc2M3ckXePjZAHty1hXVC8M8qptjz8r9QUG4';

export const supabase = createClient(supabaseUrl, supabaseKey);
