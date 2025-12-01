
const SUPABASE_URL = 'https://qqpxeesbqcbhtdlzzpkm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MvDrO8Hxm9FmWOuo3iltsg_YffWY9bb';

// Initialize Supabase client
// Note: We rely on the CDN script to provide the 'supabase' global object constructor
// or we will use the global 'supabase' object if created by the CDN script.
// Since we are using vanilla JS with CDN, we usually access it via window.supabase.createClient

let supabaseClient;

if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error('Supabase library not loaded. Make sure to include the CDN script.');
}
