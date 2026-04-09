/* ============================================================
   TIQUI — supabase.js
   Supabase Client — einmalig initialisiert, überall importierbar
   ============================================================ */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL  = 'https://ovomstveukjivfhepyyj.supabase.co';   // ← aus Supabase Dashboard → Settings → API
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92b21zdHZldWtqaXZmaGVweXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTA5MDAsImV4cCI6MjA5MTMyNjkwMH0.kFvZg2dBoOPUfO6380Y4v15fiPdFgEDNZchfIgCBVeA';        // ← aus Supabase Dashboard → Settings → API

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
