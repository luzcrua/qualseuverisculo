// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bnuazzfejvlwldolvkmy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudWF6emZlanZsd2xkb2x2a215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NzIwNzUsImV4cCI6MjA1MTM0ODA3NX0.CSw4mV4T-AdAWP8GYtMWK0nABIBNvgk_HXSraMuLsPs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);