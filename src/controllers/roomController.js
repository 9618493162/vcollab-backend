// WebRTC Room Coordination Controller
// Manages active rooms, participants, and real-time coordination

// In-memory room state (shared across server instances via Redis in production)
const activeRooms = new Map();

// Room structure:
// {
//   roomId: string,
//   meetingId: string,
//   hostId: string,
//   participants: Map<socketId, {userId, name, joinedAt, video, audio, screenShare}>,
//   settings: {recording, locked, maxParticipants},
//   createdAt: Date
// }

// Get Room Status
exports.getRoomStatus = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = activeRooms.get(roomId);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found or inactive"
            });
        }

        // Convert participants Map to array
        const participants = Array.from(room.participants.values()).map(p => ({
            userId: p.userId,
            name: p.name,
            joinedAt: p.joinedAt,
            video: p.video,
            audio: p.audio,
            screenShare: p.screenShare
        }));

        res.status(200).json({
            success: true,
            room: {
                roomId: room.roomId,
                meetingId: room.meetingId,
                hostId: room.hostId,
                participantCount: participants.length,
                participants,
                settings: room.settings,
                createdAt: room.createdAt
            }
        });

    } catch (error) {
        console.error("Get room status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get room status",
            error: error.message
        });
    }
};

// Get Active Rooms (Admin)
exports.getActiveRooms = async (req, res) => {
    try {
        const rooms = Array.from(activeRooms.values()).map(room => ({
            roomId: room.roomId,
            meetingId: room.meetingId,
            hostId: room.hostId,
            participantCount: room.participants.size,
            settings: room.settings,
            createdAt: room.createdAt
        }));

        res.status(200).json({
            success: true,
            count: rooms.length,
            rooms
        });

    } catch (error) {
        console.error("Get active rooms error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get active rooms",
            error: error.message
        });
    }
};

// Update Room Settings
exports.updateRoomSettings = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { recording, locked, maxParticipants } = req.body;

        const room = activeRooms.get(roomId);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Check if user is host
        if (room.hostId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the host can update room settings"
            });
        }

        // Update settings
        if (recording !== undefined) room.settings.recording = recording;
        if (locked !== undefined) room.settings.locked = locked;
        if (maxParticipants !== undefined) room.settings.maxParticipants = maxParticipants;

        res.status(200).json({
            success: true,
            message: "Room settings updated",
            settings: room.settings
        });

    } catch (error) {
        console.error("Update room settings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update room settings",
            error: error.message
        });
    }
};

// Helper: Create or Join Room (called from Socket.IO)
exports.createOrJoinRoom = (roomId, meetingId, socketId, userId, userName) => {
    let room = activeRooms.get(roomId);

    if (!room) {
        // Create new room
        room = {
            roomId,
            meetingId,
            hostId: userId,
            participants: new Map(),
            settings: {
                recording: false,
                locked: false,
                maxParticipants: 100
            },
            createdAt: new Date()
        };
        activeRooms.set(roomId, room);
        console.log(`✅ Room created: ${roomId}`);
    }

    // Add participant
    room.participants.set(socketId, {
        userId,
        name: userName,
        joinedAt: new Date(),
        video: true,
        audio: true,
        screenShare: false
    });

    console.log(`✅ User ${userName} joined room ${roomId} (${room.participants.size} participants)`);
    return room;
};

// Helper: Remove Participant (called from Socket.IO)
exports.removeParticipant = (roomId, socketId) => {
    const room = activeRooms.get(roomId);
    
    if (room) {
        const participant = room.participants.get(socketId);
        room.participants.delete(socketId);
        
        // Delete room if empty
        if (room.participants.size === 0) {
            activeRooms.delete(roomId);
            console.log(`✅ Room ${roomId} deleted (empty)`);
        } else {
            console.log(`✅ Participant removed from room ${roomId} (${room.participants.size} remaining)`);
        }
        
        return participant;
    }
    
    return null;
};

// Helper: Update Participant Media State
exports.updateParticipantMedia = (roomId, socketId, mediaType, enabled) => {
    const room = activeRooms.get(roomId);
    
    if (room) {
        const participant = room.participants.get(socketId);
        if (participant) {
            participant[mediaType] = enabled;
            return true;
        }
    }
    
    return false;
};

// Helper: Get Room Participant Count
exports.getParticipantCount = (roomId) => {
    const room = activeRooms.get(roomId);
    return room ? room.participants.size : 0;
};

// Helper: Is Room Locked
exports.isRoomLocked = (roomId) => {
    const room = activeRooms.get(roomId);
    return room ? room.settings.locked : false;
};

// Helper: Is Room Full
exports.isRoomFull = (roomId) => {
    const room = activeRooms.get(roomId);
    if (!room) return false;
    return room.participants.size >= room.settings.maxParticipants;
};

// Get Participant List for Room
exports.getParticipants = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = activeRooms.get(roomId);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
                participants: []
            });
        }

        const participants = Array.from(room.participants.values()).map(p => ({
            userId: p.userId,
            name: p.name,
            joinedAt: p.joinedAt,
            video: p.video,
            audio: p.audio,
            screenShare: p.screenShare
        }));

        res.status(200).json({
            success: true,
            count: participants.length,
            participants
        });

    } catch (error) {
        console.error("Get participants error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get participants",
            error: error.message
        });
    }
};

// Kick Participant (Host only)
exports.kickParticipant = async (req, res) => {
    try {
        const { roomId, userId } = req.params;

        const room = activeRooms.get(roomId);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Check if requester is host
        if (room.hostId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the host can kick participants"
            });
        }

        // Find and remove participant
        let removed = false;
        for (const [socketId, participant] of room.participants.entries()) {
            if (participant.userId === userId) {
                room.participants.delete(socketId);
                removed = true;
                break;
            }
        }

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: "Participant not found in room"
            });
        }

        res.status(200).json({
            success: true,
            message: "Participant removed from room"
        });

    } catch (error) {
        console.error("Kick participant error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to kick participant",
            error: error.message
        });
    }
};

module.exports = exports;
