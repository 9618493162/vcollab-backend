const Recording = require("../models/Recording");
const Meeting = require("../models/Meeting");
const path = require("path");
const fs = require("fs").promises;

// In-memory storage for recordings (fallback)
let inMemoryRecordings = [];

// Start Recording
exports.startRecording = async (req, res) => {
    try {
        const { meetingId, title } = req.body;

        if (!meetingId) {
            return res.status(400).json({ 
                success: false,
                message: "Meeting ID is required" 
            });
        }

        // Create recording record
        const recordingData = {
            meetingId,
            hostId: req.user.id,
            title: title || `Recording ${new Date().toISOString()}`,
            filename: `recording_${meetingId}_${Date.now()}.webm`,
            filePath: `/uploads/recordings/recording_${meetingId}_${Date.now()}.webm`,
            fileSize: 0,
            status: 'recording',
            startedAt: new Date()
        };

        let recording;
        try {
            recording = await Recording.create(recordingData);
        } catch (err) {
            recording = {
                _id: Date.now().toString(),
                ...recordingData,
                createdAt: new Date()
            };
            inMemoryRecordings.push(recording);
        }

        res.status(201).json({
            success: true,
            message: "Recording started",
            recording: {
                id: recording._id,
                meetingId: recording.meetingId,
                title: recording.title,
                status: recording.status,
                startedAt: recording.startedAt
            }
        });

    } catch (error) {
        console.error("Start recording error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to start recording",
            error: error.message 
        });
    }
};

// Stop Recording
exports.stopRecording = async (req, res) => {
    try {
        const { recordingId } = req.params;
        const { fileSize, duration } = req.body;

        let recording;
        try {
            recording = await Recording.findById(recordingId);
        } catch (err) {
            recording = inMemoryRecordings.find(r => r._id === recordingId);
        }

        if (!recording) {
            return res.status(404).json({ 
                success: false,
                message: "Recording not found" 
            });
        }

        // Check authorization
        if (recording.hostId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: "Not authorized to stop this recording" 
            });
        }

        // Update recording
        const updates = {
            status: 'ready',
            endedAt: new Date(),
            fileSize: fileSize || 0,
            duration: duration || 0
        };

        try {
            await Recording.updateOne({ _id: recordingId }, updates);
        } catch (err) {
            const index = inMemoryRecordings.findIndex(r => r._id === recordingId);
            if (index !== -1) {
                inMemoryRecordings[index] = { ...inMemoryRecordings[index], ...updates };
            }
        }

        res.status(200).json({
            success: true,
            message: "Recording stopped",
            recording: {
                id: recordingId,
                status: 'ready',
                duration: duration || 0
            }
        });

    } catch (error) {
        console.error("Stop recording error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to stop recording",
            error: error.message 
        });
    }
};

// Get User's Recordings
exports.getRecordings = async (req, res) => {
    try {
        let recordings;
        try {
            recordings = await Recording.find({ hostId: req.user.id })
                .populate('meetingId', 'title meeting_id')
                .sort({ createdAt: -1 });
        } catch (err) {
            recordings = inMemoryRecordings.filter(r => r.hostId === req.user.id);
        }

        res.status(200).json({
            success: true,
            count: recordings?.length || 0,
            recordings: recordings || []
        });

    } catch (error) {
        console.error("Get recordings error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get recordings",
            error: error.message 
        });
    }
};

// Get Recording by ID
exports.getRecordingById = async (req, res) => {
    try {
        const { recordingId } = req.params;

        let recording;
        try {
            recording = await Recording.findById(recordingId)
                .populate('meetingId', 'title meeting_id')
                .populate('hostId', 'name email');
        } catch (err) {
            recording = inMemoryRecordings.find(r => r._id === recordingId);
        }

        if (!recording) {
            return res.status(404).json({ 
                success: false,
                message: "Recording not found" 
            });
        }

        res.status(200).json({
            success: true,
            recording
        });

    } catch (error) {
        console.error("Get recording error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get recording",
            error: error.message 
        });
    }
};

// Delete Recording
exports.deleteRecording = async (req, res) => {
    try {
        const { recordingId } = req.params;

        let recording;
        try {
            recording = await Recording.findById(recordingId);
        } catch (err) {
            recording = inMemoryRecordings.find(r => r._id === recordingId);
        }

        if (!recording) {
            return res.status(404).json({ 
                success: false,
                message: "Recording not found" 
            });
        }

        // Check authorization
        if (recording.hostId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: "Not authorized to delete this recording" 
            });
        }

        // Delete file from disk if exists
        try {
            const filePath = path.join(__dirname, '../../', recording.filePath);
            await fs.unlink(filePath);
        } catch (err) {
            console.log("File not found or already deleted");
        }

        // Delete recording record
        try {
            await Recording.deleteOne({ _id: recordingId });
        } catch (err) {
            const index = inMemoryRecordings.findIndex(r => r._id === recordingId);
            if (index !== -1) {
                inMemoryRecordings.splice(index, 1);
            }
        }

        res.status(200).json({
            success: true,
            message: "Recording deleted successfully"
        });

    } catch (error) {
        console.error("Delete recording error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete recording",
            error: error.message 
        });
    }
};

// Upload Recording File (for client-side recordings)
exports.uploadRecordingFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: "No file uploaded" 
            });
        }

        const { recordingId } = req.body;

        if (!recordingId) {
            return res.status(400).json({ 
                success: false,
                message: "Recording ID is required" 
            });
        }

        // Update recording with file info
        const updates = {
            filename: req.file.filename,
            filePath: `/uploads/recordings/${req.file.filename}`,
            fileSize: req.file.size,
            status: 'ready'
        };

        try {
            await Recording.updateOne({ _id: recordingId }, updates);
        } catch (err) {
            const index = inMemoryRecordings.findIndex(r => r._id === recordingId);
            if (index !== -1) {
                inMemoryRecordings[index] = { ...inMemoryRecordings[index], ...updates };
            }
        }

        res.status(200).json({
            success: true,
            message: "Recording file uploaded successfully",
            file: {
                filename: req.file.filename,
                size: req.file.size,
                path: `/uploads/recordings/${req.file.filename}`
            }
        });

    } catch (error) {
        console.error("Upload recording error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to upload recording",
            error: error.message 
        });
    }
};
