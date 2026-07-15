const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const roomController = require("./controllers/roomController");

const PORT = process.env.PORT || 5002;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vcollab";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
    console.log("⚠️ MongoDB not available, using in-memory storage");
    console.log("To use MongoDB: Install MongoDB and start the service");
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8 // 100MB for file sharing
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join meeting room
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        
        // Update room state
        const room = roomController.createOrJoinRoom(roomId, roomId, socket.id, userId, userName || 'Guest');
        
        // Notify others
        socket.to(roomId).emit("user-connected", userId, userName);
        
        // Send current participant count
        io.to(roomId).emit("participant-count", room.participants.size);
        
        console.log(`User ${userName} (${userId}) joined room ${roomId}`);
    });

    // WebRTC signaling
    socket.on("offer", (data, roomId) => {
        socket.to(roomId).emit("offer", data, socket.id);
    });

    socket.on("answer", (data, roomId) => {
        socket.to(roomId).emit("answer", data, socket.id);
    });

    socket.on("ice-candidate", (data, roomId) => {
        socket.to(roomId).emit("ice-candidate", data, socket.id);
    });

    // Media state changes
    socket.on("toggle-video", (roomId, enabled) => {
        roomController.updateParticipantMedia(roomId, socket.id, 'video', enabled);
        socket.to(roomId).emit("user-video-toggle", socket.id, enabled);
    });

    socket.on("toggle-audio", (roomId, enabled) => {
        roomController.updateParticipantMedia(roomId, socket.id, 'audio', enabled);
        socket.to(roomId).emit("user-audio-toggle", socket.id, enabled);
    });

    socket.on("screen-share-started", (roomId, userId) => {
        roomController.updateParticipantMedia(roomId, socket.id, 'screenShare', true);
        socket.to(roomId).emit("user-screen-share-started", userId);
    });

    socket.on("screen-share-stopped", (roomId, userId) => {
        roomController.updateParticipantMedia(roomId, socket.id, 'screenShare', false);
        socket.to(roomId).emit("user-screen-share-stopped", userId);
    });

    // Chat messages
    socket.on("send-message", (message, roomId) => {
        io.to(roomId).emit("receive-message", {
            ...message,
            timestamp: new Date().toISOString()
        });
    });

    // File sharing
    socket.on("file-shared", (fileData, roomId) => {
        socket.to(roomId).emit("file-shared", {
            ...fileData,
            timestamp: new Date().toISOString()
        });
        console.log(`File ${fileData.name} shared in room ${roomId}`);
    });

    // Raise hand
    socket.on("hand-raised", (data, roomId) => {
        io.to(roomId).emit("hand-raised", {
            ...data,
            timestamp: new Date().toISOString()
        });
        console.log(`${data.userName} ${data.raised ? 'raised' : 'lowered'} hand in room ${roomId}`);
    });

    // Reactions
    socket.on("reaction-sent", (data, roomId) => {
        socket.to(roomId).emit("reaction-sent", {
            ...data,
            timestamp: new Date().toISOString()
        });
    });

    // Host controls
    socket.on("mute-participant", (data, roomId) => {
        io.to(roomId).emit("mute-participant", data);
        console.log(`Host muted participant ${data.userId} in room ${roomId}`);
    });

    socket.on("remove-participant", (data, roomId) => {
        io.to(roomId).emit("remove-participant", data);
        console.log(`Host removed participant ${data.userId} from room ${roomId}`);
    });

    // Recording events
    socket.on("recording-started", (roomId) => {
        io.to(roomId).emit("recording-started");
    });

    socket.on("recording-stopped", (roomId) => {
        io.to(roomId).emit("recording-stopped");
    });

    // Whiteboard events
    socket.on("whiteboard-draw", (data, roomId) => {
        socket.to(roomId).emit("whiteboard-draw", data);
    });

    socket.on("whiteboard-clear", (roomId) => {
        socket.to(roomId).emit("whiteboard-clear");
    });

    // Poll events
    socket.on("poll-created", (poll, roomId) => {
        io.to(roomId).emit("poll-created", poll);
    });

    socket.on("poll-vote", (data, roomId) => {
        io.to(roomId).emit("poll-vote", data);
    });

    // Breakout room events
    socket.on("breakout-rooms-created", (rooms, roomId) => {
        io.to(roomId).emit("breakout-rooms-created", rooms);
    });

    socket.on("assign-to-breakout", (data, roomId) => {
        io.to(roomId).emit("assign-to-breakout", data);
    });

    // Leave room
    socket.on("leave-room", (roomId) => {
        const participant = roomController.removeParticipant(roomId, socket.id);
        if (participant) {
            socket.to(roomId).emit("user-disconnected", participant.userId);
            const count = roomController.getParticipantCount(roomId);
            io.to(roomId).emit("participant-count", count);
        }
        socket.leave(roomId);
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Clean up from all rooms
        // Note: In production, track which rooms the socket is in
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 =======================================`);
    console.log(`✅ VCollab Backend Server v1.0`);
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ API: http://localhost:${PORT}`);
    console.log(`✅ Socket.IO ready for connections`);
    console.log(`✅ Rate limiting enabled`);
    console.log(`✅ Security middleware active`);
    console.log(`🚀 =======================================\n`);
});

