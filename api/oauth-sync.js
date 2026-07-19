const jwt = require("jsonwebtoken");
const { verifyAuthToken } = require("../src/utils/verifyToken");

const generateAccessToken = (userId, fullName, email) => {
    return jwt.sign(
        { id: userId, fullName, email },
        process.env.JWT_SECRET || "default-secret",
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
        { expiresIn: "7d" }
    );
};

const setCorsHeaders = (req, res) => {
    const origin = req.headers.origin || "*";
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
    );
};

module.exports = async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        const authToken = req.headers.authorization?.replace("Bearer ", "");

        if (!authToken) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const user = await verifyAuthToken(authToken);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
        }

        const accessToken = generateAccessToken(user.id, user.fullName, user.email);
        const refreshToken = generateRefreshToken(user.id);

        return res.status(200).json({
            success: true,
            message: "OAuth session synced",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("OAuth sync error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to sync OAuth session",
            error: error.message,
        });
    }
};
