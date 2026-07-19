const { AccessToken } = require('livekit-server-sdk');

// LiveKit configuration
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

/**
 * Generate LiveKit access token for a participant
 * @param {string} roomName - Meeting room name (meeting ID)
 * @param {string} participantName - User's display name
 * @param {string} participantIdentity - User's unique ID
 * @param {object} options - Additional options (isHost, canPublish, etc.)
 * @returns {string} JWT token for LiveKit
 */
const generateToken = (roomName, participantName, participantIdentity, options = {}) => {
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
        throw new Error('LiveKit credentials not configured');
    }

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: participantIdentity,
        name: participantName,
    });

    // Set token to expire in 2 hours
    at.ttl = '2h';

    // Grant permissions
    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: options.canPublish !== false, // Default: true
        canPublishData: options.canPublishData !== false, // Default: true (for chat)
        canSubscribe: options.canSubscribe !== false, // Default: true
        canUpdateOwnMetadata: true,
        
        // Host permissions
        ...(options.isHost && {
            roomAdmin: true,
            roomRecord: true,
            roomCreate: true,
        }),
    });

    return at.toJwt();
};

/**
 * Generate token for meeting host
 */
const generateHostToken = (roomName, participantName, participantIdentity) => {
    return generateToken(roomName, participantName, participantIdentity, {
        isHost: true,
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
    });
};

/**
 * Generate token for regular participant
 */
const generateParticipantToken = (roomName, participantName, participantIdentity) => {
    return generateToken(roomName, participantName, participantIdentity, {
        isHost: false,
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
    });
};

/**
 * Generate token for view-only participant (e.g., waiting room)
 */
const generateViewerToken = (roomName, participantName, participantIdentity) => {
    return generateToken(roomName, participantName, participantIdentity, {
        isHost: false,
        canPublish: false,
        canPublishData: false,
        canSubscribe: true,
    });
};

/**
 * Validate LiveKit configuration
 */
const isConfigured = () => {
    return !!(LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET);
};

/**
 * Get LiveKit WebSocket URL
 */
const getWebSocketUrl = () => {
    if (!LIVEKIT_URL) {
        throw new Error('LiveKit URL not configured');
    }
    return LIVEKIT_URL;
};

module.exports = {
    generateToken,
    generateHostToken,
    generateParticipantToken,
    generateViewerToken,
    isConfigured,
    getWebSocketUrl,
    LIVEKIT_URL,
};
