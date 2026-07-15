const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");
const auth = require("../middleware/auth");
const { meetingLimiter } = require("../middleware/rateLimiter");
const {
    validateCreateMeeting,
    validateJoinMeeting,
    validateMeetingId
} = require("../middleware/validation");

// All routes require authentication
router.post("/create", auth, meetingLimiter, validateCreateMeeting, meetingController.createMeeting);
router.post("/join", auth, validateJoinMeeting, meetingController.joinMeeting);
router.get("/list", auth, meetingController.getMeetings);
router.get("/:meetingId", auth, validateMeetingId, meetingController.getMeetingById);

module.exports = router;
