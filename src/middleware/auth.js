const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

// Shared in-memory user store (same reference as authController)
// This is populated when Supabase is unavailable
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Authentication required" 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret");
        
        let user = null;

        // Try Supabase first
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("id, full_name, email")
                    .eq("id", decoded.id)
                    .single();
                
                if (!error && data) {
                    user = {
                        id: data.id,
                        fullName: data.full_name,
                        email: data.email
                    };
                } else if (error) {
                    console.warn("Supabase auth lookup failed:", error.message);
                }
            } catch (err) {
                console.warn("Supabase auth error:", err.message);
            }
        }

        // Fallback: try MongoDB
        if (!user) {
            try {
                const dbUser = await User.findById(decoded.id).select("id name email");
                if (dbUser) {
                    user = {
                        id: dbUser._id.toString(),
                        fullName: dbUser.name,
                        email: dbUser.email
                    };
                }
            } catch (err) {
                // MongoDB not available
            }
        }

        // Fallback: trust the token itself (in-memory users don't persist across restarts)
        // This allows meeting creation etc. to work even if DB lookup fails
        if (!user) {
            console.warn(`⚠️ User ${decoded.id} not found in DB - using token claims`);
            user = {
                id: decoded.id,
                fullName: decoded.fullName || "User",
                email: decoded.email || ""
            };
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({ 
            success: false,
            message: "Invalid or expired token" 
        });
    }
};

module.exports = auth;
