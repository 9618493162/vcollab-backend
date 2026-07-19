// Test authentication endpoint
const jwt = require("jsonwebtoken");

let supabase = null;

function getSupabase() {
    if (!supabase) {
        const { createClient } = require("@supabase/supabase-js");
        const supabaseUrl = process.env.SUPABASE_URL || "https://wwdbdstbbpcmcbzwgunj.supabase.co";
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA";
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabase;
}

async function verifyAuthToken(token) {
    if (!token) {
        return { success: false, error: "No token provided" };
    }

    // Try Backend-issued JWT first
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret");
        return {
            success: true,
            method: "JWT",
            user: {
                id: decoded.id,
                fullName: decoded.fullName || decoded.full_name || "User",
                email: decoded.email || "",
            }
        };
    } catch (jwtError) {
        console.log("JWT verification failed:", jwtError.message);
    }

    // Try Supabase OAuth token
    const sb = getSupabase();
    if (sb) {
        try {
            const { data, error } = await sb.auth.getUser(token);
            if (!error && data?.user) {
                const user = data.user;
                return {
                    success: true,
                    method: "Supabase",
                    user: {
                        id: user.id,
                        fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
                        email: user.email || "",
                    }
                };
            } else {
                return { success: false, error: "Supabase auth failed", details: error };
            }
        } catch (err) {
            return { success: false, error: "Supabase exception", message: err.message };
        }
    }

    return { success: false, error: "All verification methods failed" };
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const authToken = req.headers.authorization?.replace('Bearer ', '');
    
    const result = await verifyAuthToken(authToken);
    
    res.status(result.success ? 200 : 401).json({
        ...result,
        tokenLength: authToken?.length || 0,
        tokenPrefix: authToken?.substring(0, 20) + "...",
        env: {
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasSupabaseUrl: !!process.env.SUPABASE_URL,
            hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
        }
    });
};
