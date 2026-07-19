// Standalone meeting creation endpoint
const jwt = require("jsonwebtoken");

let supabase = null;

// Lazy load Supabase
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

// Inline token verification
async function verifyAuthToken(token) {
    if (!token) {
        return null;
    }

    // Backend-issued JWT (email/password login)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret");
        return {
            id: decoded.id,
            fullName: decoded.fullName || decoded.full_name || "User",
            email: decoded.email || "",
        };
    } catch (_) {
        // Fall through to Supabase OAuth/session tokens
    }

    // Try Supabase OAuth token
    const sb = getSupabase();
    if (sb) {
        try {
            const { data, error } = await sb.auth.getUser(token);
            if (!error && data?.user) {
                const user = data.user;
                return {
                    id: user.id,
                    fullName:
                        user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email?.split("@")[0] ||
                        "User",
                    email: user.email || "",
                };
            }
        } catch (err) {
            console.warn("Supabase token verification failed:", err.message);
        }
    }

    return null;
}

const generateMeetingId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = async (req, res) => {
    console.log("=== Meeting Create Request ===");
    console.log("Method:", req.method);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        // Get auth token
        const authToken = req.headers.authorization?.replace('Bearer ', '');
        console.log("Auth token present:", !!authToken);
        console.log("Auth token length:", authToken?.length || 0);
        
        if (!authToken) {
            console.log("ERROR: No auth token");
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        console.log("Verifying token...");
        const decoded = await verifyAuthToken(authToken);
        console.log("Token verification result:", decoded ? "SUCCESS" : "FAILED");
        console.log("Decoded user:", JSON.stringify(decoded, null, 2));
        
        if (!decoded) {
            console.log("ERROR: Invalid token");
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
        }
        
        const { title, description, scheduledDate, scheduledTime, type, passcode } = req.body;
        console.log("Request data:", { title, description, type });
        
        const meetingId = generateMeetingId();
        console.log("Generated meeting ID:", meetingId);

        // Get Supabase client
        console.log("Getting Supabase client...");
        const sb = getSupabase();
        console.log("Supabase client:", !!sb);

        // Insert meeting
        console.log("Inserting meeting into database...");
        const { data: meeting, error } = await sb
            .from("meetings")
            .insert([
                {
                    meeting_id: meetingId,
                    title: title || 'Quick Meeting',
                    description: description || '',
                    host_id: decoded.id,
                    host_name: decoded.fullName || 'Host',
                    status: type === 'instant' ? 'active' : 'scheduled',
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            return res.status(500).json({
                success: false,
                message: "Failed to create meeting",
                error: error.message,
                details: error.details || error.hint || null
            });
        }

        console.log("Meeting created successfully:", meeting);

        // Add host as participant
        console.log("Adding host as participant...");
        const { error: participantError } = await sb
            .from("participants")
            .insert([
                {
                    meeting_id: meeting.id,
                    user_id: decoded.id
                }
            ]);

        if (participantError) {
            console.error("Add participant error:", participantError);
            // Don't fail the whole request
        }

        console.log("=== Meeting Create SUCCESS ===");
        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            meeting: {
                id: meeting.id,
                meetingId: meeting.meeting_id,
                title: meeting.title,
                description: meeting.description,
                status: meeting.status,
                createdAt: meeting.created_at
            }
        });

    } catch (error) {
        console.error("=== Meeting Create EXCEPTION ===");
        console.error("Create meeting error:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        res.status(500).json({
            success: false,
            message: "Failed to create meeting",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
