const express = require("express");
const router = express.Router();
const recordingController = require("../controllers/recordingController");
const auth = require("../middleware/auth");

// All routes require authentication
router.post("/start", auth, recordingController.startRecording);
router.post("/:recordingId/stop", auth, recordingController.stopRecording);
router.get("/list", auth, recordingController.getRecordings);
router.get("/:recordingId", auth, recordingController.getRecordingById);
router.delete("/:recordingId", auth, recordingController.deleteRecording);
router.post("/upload", auth, recordingController.uploadRecordingFile);

module.exports = router;
