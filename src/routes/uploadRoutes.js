const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const auth = require("../middleware/auth");
const { uploadLimiter } = require("../middleware/rateLimiter");

// All routes require authentication and rate limiting
router.use(auth);
router.use(uploadLimiter);

// Upload endpoints
router.post("/avatar", uploadController.uploadAvatar);
router.post("/meeting-file", uploadController.uploadMeetingFile);
router.post("/recording", uploadController.uploadRecordingFile);
router.delete("/file", uploadController.deleteFile);

module.exports = router;
