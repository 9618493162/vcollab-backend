const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

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

    if (supabase) {
        try {
            const { data, error } = await supabase.auth.getUser(token);
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

module.exports = { verifyAuthToken };
