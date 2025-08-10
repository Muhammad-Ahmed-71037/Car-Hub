import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fykkrpmdeqxrbipbobzh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a2tycG1kZXF4cmJpcGJvYnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDE4MzYsImV4cCI6MjA2OTIxNzgzNn0.m-ZyCIY_Z6dXqxeLPVbdoXSJB1PyDxg47RKCgyIGJKY"
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);