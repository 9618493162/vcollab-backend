const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const { validatePagination, validateUserId } = require("../middleware/validation");

// All routes require authentication and admin role
router.use(auth);
router.use(adminController.isAdmin);

// User management
router.get("/users", validatePagination, adminController.getAllUsers);
router.get("/users/:userId", validateUserId, adminController.getUserById);
router.put("/users/:userId", validateUserId, adminController.updateUser);
router.delete("/users/:userId", validateUserId, adminController.deleteUser);

// Meeting management
router.get("/meetings", validatePagination, adminController.getAllMeetings);
router.delete("/meetings/:meetingId", adminController.deleteMeeting);

// System statistics
router.get("/stats", adminController.getStats);

module.exports = router;
