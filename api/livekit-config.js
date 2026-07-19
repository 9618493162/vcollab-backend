// Standalone LiveKit config check endpoint
module.exports = (req, res) => {
    try {
        const LIVEKIT_URL = process.env.LIVEKIT_URL;
        const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
        const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

        const configured = !!(LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET);

        if (!configured) {
            return res.status(200).json({
                success: true,
                configured: false,
                message: "LiveKit is not configured. Please set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET in environment variables.",
                missing: {
                    url: !LIVEKIT_URL,
                    apiKey: !LIVEKIT_API_KEY,
                    apiSecret: !LIVEKIT_API_SECRET
                }
            });
        }

        res.status(200).json({
            success: true,
            configured: true,
            url: LIVEKIT_URL,
            message: "LiveKit is configured and ready"
        });

    } catch (error) {
        console.error("Get LiveKit config error:", error);
        res.status(200).json({
            success: false,
            configured: false,
            message: "Error checking LiveKit configuration",
            error: error.message
        });
    }
};
