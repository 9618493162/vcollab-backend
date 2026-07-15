const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer storage for avatars
const avatarStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/avatars');
        try {
            await fs.mkdir(uploadPath, { recursive: true });
        } catch (err) {
            console.error('Error creating upload directory:', err);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `avatar-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Configure multer storage for meeting files
const meetingFileStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/meeting-files');
        try {
            await fs.mkdir(uploadPath, { recursive: true });
        } catch (err) {
            console.error('Error creating upload directory:', err);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `file-${uniqueSuffix}-${sanitizedName}`);
    }
});

// Configure multer storage for recordings
const recordingStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/recordings');
        try {
            await fs.mkdir(uploadPath, { recursive: true });
        } catch (err) {
            console.error('Error creating upload directory:', err);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `recording-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// File filter for meeting files (more permissive)
const meetingFileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('File type not allowed'));
    }
};

// File filter for recordings
const recordingFilter = (req, file, cb) => {
    const allowedTypes = /webm|mp4|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/');

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only video files are allowed (webm, mp4, mkv)'));
    }
};

// Multer instances
const uploadAvatar = multer({
    storage: avatarStorage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
    },
    fileFilter: imageFilter
}).single('avatar');

const uploadMeetingFile = multer({
    storage: meetingFileStorage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB for meeting files
    },
    fileFilter: meetingFileFilter
}).single('file');

const uploadRecording = multer({
    storage: recordingStorage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB for recordings
    },
    fileFilter: recordingFilter
}).single('recording');

// Upload Avatar Controller
exports.uploadAvatar = (req, res) => {
    uploadAvatar(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 10MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Return file URL
        const fileUrl = `/uploads/avatars/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: 'Avatar uploaded successfully',
            fileUrl,
            file: {
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    });
};

// Upload Meeting File Controller
exports.uploadMeetingFile = (req, res) => {
    uploadMeetingFile(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 50MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const fileUrl = `/uploads/meeting-files/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            fileUrl,
            file: {
                originalName: req.file.originalname,
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    });
};

// Upload Recording Controller
exports.uploadRecordingFile = (req, res) => {
    uploadRecording(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 500MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const fileUrl = `/uploads/recordings/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: 'Recording uploaded successfully',
            fileUrl,
            file: {
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype,
                duration: req.body.duration || 0
            }
        });
    });
};

// Delete File Controller (generic)
exports.deleteFile = async (req, res) => {
    try {
        const { filePath } = req.body;

        if (!filePath) {
            return res.status(400).json({
                success: false,
                message: 'File path is required'
            });
        }

        // Security: Only allow deletion from uploads directory
        if (!filePath.startsWith('/uploads/')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file path'
            });
        }

        const fullPath = path.join(__dirname, '../..', filePath);
        
        try {
            await fs.unlink(fullPath);
            res.status(200).json({
                success: true,
                message: 'File deleted successfully'
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
};
