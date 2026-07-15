const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const { authLimiter, passwordResetLimiter } = require("../middleware/rateLimiter");
const { bruteForceProtection, auditTrail } = require("../middleware/security");
const { securityEventLogger } = require("../middleware/logger");
const {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateChangePassword,
    validateUpdateProfile
} = require("../middleware/validation");

// Public routes (with rate limiting and brute force protection)
router.post("/register", 
    authLimiter, 
    validateRegister, 
    securityEventLogger('user_registration'),
    auditTrail('user_registration'),
    authController.register
);

router.post("/login", 
    authLimiter, 
    bruteForceProtection,
    validateLogin, 
    securityEventLogger('user_login'),
    auditTrail('user_login'),
    authController.login
);

router.post("/refresh-token", 
    securityEventLogger('token_refresh'),
    authController.refreshToken
);

router.post("/logout", 
    securityEventLogger('user_logout'),
    auditTrail('user_logout'),
    authController.logout
);

// Password reset routes (with strict rate limiting)
router.post("/forgot-password", 
    passwordResetLimiter, 
    validateForgotPassword, 
    securityEventLogger('password_reset_request'),
    auditTrail('password_reset_request'),
    authController.forgotPassword
);

router.post("/reset-password", 
    passwordResetLimiter, 
    validateResetPassword, 
    securityEventLogger('password_reset_complete'),
    auditTrail('password_reset_complete'),
    authController.resetPassword
);

// Protected routes
router.get("/profile", 
    auth, 
    authController.getProfile
);

router.put("/profile", 
    auth, 
    validateUpdateProfile, 
    securityEventLogger('profile_update'),
    auditTrail('profile_update'),
    authController.updateProfile
);

router.post("/change-password", 
    auth, 
    validateChangePassword, 
    securityEventLogger('password_change'),
    auditTrail('password_change'),
    authController.changePassword
);

module.exports = router;
