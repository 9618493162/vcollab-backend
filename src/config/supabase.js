const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || "https://wwdbdstbbpcmcbzwgunj.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 
    // Correct current key (iat: 1784210272)
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA";

if (!supabaseUrl || !supabaseAnonKey) {
    console.log("⚠️ Supabase not configured - using MongoDB/in-memory storage");
    module.exports = null;
} else {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase client configured successfully");
    module.exports = supabase;
}

