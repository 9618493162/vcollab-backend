const { createClient } = require("@supabase/supabase-js");

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Make Supabase optional - return null if not configured
if (!supabaseUrl || !supabaseAnonKey) {
    console.log("⚠️ Supabase not configured - using MongoDB/in-memory storage");
    module.exports = null;
} else {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase client configured successfully");
    module.exports = supabase;
}

