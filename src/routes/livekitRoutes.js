const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const livekitService = require("../services/livekitService");
const supabase = require("../config/supabase");

/**
 * Generate LiveKit token for joining a meeting
 * POST /api/livekit/token
 */
router.post("/token", auth, async (req, res) => {
    try {
        const { meetingId, roomName } = req.body;
        
        if (!meetingId && !roomName) {
            return res.status(400).json({
                success: false,
                message: "Meeting ID or room name is required"
            });
        }

        // Check if LiveKit is configured
        if (!livekitService.isConfigured()) {
            return res.status(503).json({
                success: false,
                message: "LiveKit is not configured. Please set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET in environment variables."
            });
        }

        const userId = req.user.id;
        const userName = req.user.fullName || req.user.email || 'Guest';
        const room = roomName || meetingId;

        // Check if user is the host
        let isHost = false;
        if (meetingId) {
            const { data: meeting } = await supabase
                .from("meetings")
                .select("host_id")
                .eq("meeting_id", meetingId)
                .single();

            isHost = meeting && meeting.host_id === userId;
        }

        // Generate appropriate token
        const token = isHost 
            ? livekitService.generateHostToken(room, userName, userId)
            : livekitService.generateParticipantToken(room, userName, userId);

        res.status(200).json({
            success: true,
            token,
            url: livekitService.getWebSocketUrl(),
            roomName: room,
            identity: userId,
            name: userName,
            isHost
        });

    } catch (error) {
        console.error("Generate LiveKit token error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate LiveKit token",
            error: error.message
        });
    }
});

/**
 * Get LiveKit configuration (public)
 * GET /api/livekit/config
 */
router.get("/config", (req, res) => {
    try {
        const configured = livekitService.isConfigured();
        
        if (!configured) {
            return res.status(200).json({
                success: true,
                configured: false,
                message: "LiveKit is not configured. Please set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET in environment variables."
            });
        }

        res.status(200).json({
            success: true,
            configured: true,
            url: livekitService.LIVEKIT_URL,
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
});

/**
 * Webhook endpoint for LiveKit events (optional)
 * POST /api/livekit/webhook
 */
router.post("/webhook", async (req, res) => {
    try {
        const event = req.body;

        console.log("LiveKit webhook event:", event);

        // Handle different event types
        switch (event.event) {
            case "room_started":
                console.log(`Room started: ${event.room.name}`);
                // Update meeting status in database
                break;

            case "room_finished":
                console.log(`Room finished: ${event.room.name}`);
                // Update meeting status and duration
                break;

            case "participant_joined":
                console.log(`Participant joined: ${event.participant.identity}`);
                // Track participant join time
                break;

            case "participant_left":
                console.log(`Participant left: ${event.participant.identity}`);
                // Track participant leave time
                break;

            case "track_published":
                console.log(`Track published: ${event.track.type} by ${event.participant.identity}`);
                break;

            case "track_unpublished":
                console.log(`Track unpublished: ${event.track.type} by ${event.participant.identity}`);
                break;

            default:
                console.log(`Unknown event: ${event.event}`);
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("LiveKit webhook error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
