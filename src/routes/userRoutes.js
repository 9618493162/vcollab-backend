const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// All routes require authentication
// Sprint 5 - Settings endpoints
router.get("/settings", auth, userController.getUserSettings);
router.put("/settings", auth, userController.updateUserSettings);
router.get("/profile", auth, userController.getUserProfile);
router.put("/profile", auth, userController.updateUserProfile);

module.exports = router;
