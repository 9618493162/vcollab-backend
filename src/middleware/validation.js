const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Validation rules for registration
const validateRegister = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    validate
];

// Validation rules for login
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];

// Validation rules for password reset request
const validateForgotPassword = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    validate
];

// Validation rules for password reset
const validateResetPassword = [
    body('token')
        .notEmpty().withMessage('Reset token is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    validate
];

// Validation rules for change password
const validateChangePassword = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    validate
];

// Validation rules for creating meeting
const validateCreateMeeting = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('date')
        .optional()
        .isISO8601().withMessage('Invalid date format'),
    body('time')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format (HH:MM)'),
    body('type')
        .optional()
        .isIn(['Public', 'Private', 'instant', 'scheduled']).withMessage('Type must be Public, Private, instant, or scheduled'),
    body('passcode')
        .optional()
        .trim()
        .isLength({ min: 4, max: 20 }).withMessage('Passcode must be 4-20 characters'),
    validate
];

// Validation rules for joining meeting
const validateJoinMeeting = [
    body('meetingId')
        .notEmpty().withMessage('Meeting ID is required')
        .isLength({ min: 6, max: 10 }).withMessage('Invalid meeting ID format'),
    body('passcode')
        .optional()
        .trim(),
    validate
];

// Validation rules for meeting ID parameter
const validateMeetingId = [
    param('meetingId')
        .notEmpty().withMessage('Meeting ID is required')
        .isLength({ min: 6, max: 10 }).withMessage('Invalid meeting ID format'),
    validate
];

// Validation rules for user ID parameter
const validateUserId = [
    param('userId')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID format'),
    validate
];

// Validation rules for pagination
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validate
];

// Validation rules for update profile
const validateUpdateProfile = [
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('avatar')
        .optional()
        .isURL().withMessage('Avatar must be a valid URL'),
    validate
];

module.exports = {
    validate,
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateChangePassword,
    validateCreateMeeting,
    validateJoinMeeting,
    validateMeetingId,
    validateUserId,
    validatePagination,
    validateUpdateProfile
};
