const supabase = require("../config/supabase");
const User = require("../models/User");
const { verifyAuthToken } = require("../utils/verifyToken");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const tokenUser = await verifyAuthToken(token);
        if (!tokenUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        let user = null;

        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("id, full_name, email")
                    .eq("id", tokenUser.id)
                    .single();

                if (!error && data) {
                    user = {
                        id: data.id,
                        fullName: data.full_name,
                        email: data.email,
                    };
                } else if (error) {
                    console.warn("Supabase auth lookup failed:", error.message);
                }
            } catch (err) {
                console.warn("Supabase auth error:", err.message);
            }
        }

        if (!user) {
            try {
                const dbUser = await User.findById(tokenUser.id).select("id name email");
                if (dbUser) {
                    user = {
                        id: dbUser._id.toString(),
                        fullName: dbUser.name,
                        email: dbUser.email,
                    };
                }
            } catch (_) {
                // MongoDB not available
            }
        }

        if (!user) {
            user = tokenUser;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = auth;
