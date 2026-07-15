const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const auth = require("../middleware/auth");

// All routes require authentication
router.get("/:roomId/status", auth, roomController.getRoomStatus);
router.get("/:roomId/participants", auth, roomController.getParticipants);
router.put("/:roomId/settings", auth, roomController.updateRoomSettings);
router.delete("/:roomId/participants/:userId", auth, roomController.kickParticipant);

// Admin route
router.get("/active", auth, roomController.getActiveRooms);

module.exports = router;
