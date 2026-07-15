const User = require("../models/User");
const Meeting = require("../models/Meeting");
const Recording = require("../models/Recording");

// In-memory storage fallback
let inMemoryUsers = [];
let inMemoryMeetings = [];
let inMemoryRecordings = [];

// Middleware to check admin role (add to routes)
exports.isAdmin = async (req, res, next) => {
    try {
        let user;
        try {
            user = await User.findById(req.user.id);
        } catch (err) {
            user = inMemoryUsers.find(u => u._id === req.user.id);
        }

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: "Admin access required" 
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Authorization check failed" 
        });
    }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        let users;
        let total;
        try {
            users = await User.find(query)
                .select('-password')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 });
            total = await User.countDocuments(query);
        } catch (err) {
            // In-memory fallback
            users = inMemoryUsers.filter(u => {
                if (!search) return true;
                return u.name.toLowerCase().includes(search.toLowerCase()) ||
                       u.email.toLowerCase().includes(search.toLowerCase());
            });
            total = users.length;
            const start = (page - 1) * limit;
            users = users.slice(start, start + limit);
        }

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            users
        });

    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get users",
            error: error.message 
        });
    }
};

// Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        let user;
        try {
            user = await User.findById(userId).select('-password');
        } catch (err) {
            user = inMemoryUsers.find(u => u._id === userId);
            if (user) {
                const { password, ...userWithoutPassword } = user;
                user = userWithoutPassword;
            }
        }

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get user",
            error: error.message 
        });
    }
};

// Update User (Admin)
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, role } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (role) updates.role = role;

        let user;
        try {
            user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        } catch (err) {
            const index = inMemoryUsers.findIndex(u => u._id === userId);
            if (index !== -1) {
                inMemoryUsers[index] = { ...inMemoryUsers[index], ...updates };
                const { password, ...userWithoutPassword } = inMemoryUsers[index];
                user = userWithoutPassword;
            }
        }

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update user",
            error: error.message 
        });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Don't allow deleting self
        if (userId === req.user.id) {
            return res.status(400).json({ 
                success: false,
                message: "Cannot delete your own account" 
            });
        }

        let user;
        try {
            user = await User.findById(userId);
        } catch (err) {
            user = inMemoryUsers.find(u => u._id === userId);
        }

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Delete user
        try {
            await User.deleteOne({ _id: userId });
        } catch (err) {
            const index = inMemoryUsers.findIndex(u => u._id === userId);
            if (index !== -1) {
                inMemoryUsers.splice(index, 1);
            }
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete user",
            error: error.message 
        });
    }
};

// Get All Meetings
exports.getAllMeetings = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        let meetings;
        let total;
        try {
            meetings = await Meeting.find(query)
                .populate('host_id', 'name email')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 });
            total = await Meeting.countDocuments(query);
        } catch (err) {
            meetings = inMemoryMeetings.filter(m => !status || m.status === status);
            total = meetings.length;
            const start = (page - 1) * limit;
            meetings = meetings.slice(start, start + limit);
        }

        res.status(200).json({
            success: true,
            count: meetings.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            meetings
        });

    } catch (error) {
        console.error("Get all meetings error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get meetings",
            error: error.message 
        });
    }
};

// Delete Meeting (Admin)
exports.deleteMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;

        let meeting;
        try {
            meeting = await Meeting.findById(meetingId);
        } catch (err) {
            meeting = inMemoryMeetings.find(m => m._id === meetingId);
        }

        if (!meeting) {
            return res.status(404).json({ 
                success: false,
                message: "Meeting not found" 
            });
        }

        // Delete meeting
        try {
            await Meeting.deleteOne({ _id: meetingId });
        } catch (err) {
            const index = inMemoryMeetings.findIndex(m => m._id === meetingId);
            if (index !== -1) {
                inMemoryMeetings.splice(index, 1);
            }
        }

        res.status(200).json({
            success: true,
            message: "Meeting deleted successfully"
        });

    } catch (error) {
        console.error("Delete meeting error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete meeting",
            error: error.message 
        });
    }
};

// Get System Statistics
exports.getStats = async (req, res) => {
    try {
        let stats = {
            totalUsers: 0,
            totalMeetings: 0,
            activeMeetings: 0,
            totalRecordings: 0,
            storageUsed: 0
        };

        try {
            stats.totalUsers = await User.countDocuments();
            stats.totalMeetings = await Meeting.countDocuments();
            stats.activeMeetings = await Meeting.countDocuments({ status: 'active' });
            stats.totalRecordings = await Recording.countDocuments();
            
            // Calculate storage
            const recordings = await Recording.find();
            stats.storageUsed = recordings.reduce((sum, r) => sum + (r.fileSize || 0), 0);
        } catch (err) {
            // In-memory fallback
            stats.totalUsers = inMemoryUsers.length;
            stats.totalMeetings = inMemoryMeetings.length;
            stats.activeMeetings = inMemoryMeetings.filter(m => m.status === 'active').length;
            stats.totalRecordings = inMemoryRecordings.length;
            stats.storageUsed = inMemoryRecordings.reduce((sum, r) => sum + (r.fileSize || 0), 0);
        }

        // Get recent activity
        let recentUsers;
        let recentMeetings;
        try {
            recentUsers = await User.find().select('name email createdAt').sort({ createdAt: -1 }).limit(5);
            recentMeetings = await Meeting.find().select('title meeting_id createdAt').sort({ createdAt: -1 }).limit(5);
        } catch (err) {
            recentUsers = inMemoryUsers.slice(0, 5);
            recentMeetings = inMemoryMeetings.slice(0, 5);
        }

        res.status(200).json({
            success: true,
            stats,
            recentUsers,
            recentMeetings
        });

    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get statistics",
            error: error.message 
        });
    }
};
