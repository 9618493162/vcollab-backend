const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Authentication required" 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const { data: user, error } = await supabase
            .from("users")
            .select("id, full_name, email")
            .eq("id", decoded.id)
            .single();
        
        if (error || !user) {
            return res.status(401).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Attach user to request
        req.user = {
            id: user.id,
            fullName: user.full_name,
            email: user.email
        };
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ 
            success: false,
            message: "Invalid or expired token" 
        });
    }
};

module.exports = auth;
