// Standalone LiveKit token generation endpoint
const { AccessToken } = require('livekit-server-sdk');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
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
        
        if (!authToken) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify JWT
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'default-secret');
        
        // Get meeting ID from request
        const { meetingId, roomName } = req.body;
        
        if (!meetingId && !roomName) {
            return res.status(400).json({
                success: false,
                message: 'Meeting ID or room name is required'
            });
        }

        // Check LiveKit configuration
        const LIVEKIT_URL = process.env.LIVEKIT_URL;
        const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
        const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

        if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
            return res.status(503).json({
                success: false,
                message: 'LiveKit is not configured. Please set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.'
            });
        }

        // User info from JWT
        const userId = decoded.id;
        const userName = decoded.fullName || decoded.email || 'Guest';
        const room = roomName || meetingId;

        // Generate LiveKit token
        const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
            identity: userId,
            name: userName,
        });

        // Set token to expire in 2 hours
        at.ttl = '2h';

        // Grant permissions (participant by default)
        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: true,
            canPublishData: true,
            canSubscribe: true,
            canUpdateOwnMetadata: true,
        });

        const token = at.toJwt();

        res.status(200).json({
            success: true,
            token,
            url: LIVEKIT_URL,
            roomName: room,
            identity: userId,
            name: userName,
            isHost: false // We can enhance this later to check if user is meeting host
        });

    } catch (error) {
        console.error('LiveKit token generation error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to generate LiveKit token',
            error: error.message
        });
    }
};
