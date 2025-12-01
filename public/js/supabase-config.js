
const SUPABASE_URL = 'https://qqpxeesbqcbhtdlzzpkm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MvDrO8Hxm9FmWOuo3iltsg_YffWY9bb';

// Initialize Supabase client
// Note: We rely on the CDN script to provide the 'supabase' global object constructor

if (typeof supabase !== 'undefined') {
  // Make it globally available on window object
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase client initialized');
} else {
  console.error('Supabase library not loaded. Make sure to include the CDN script.');
}
