const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const supabase = require("../config/supabase");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const PasswordReset = require("../models/PasswordReset");
const emailService = require("../services/emailService");

// In-memory storage (fallback if Supabase not available)
let inMemoryUsers = [];
let inMemoryRefreshTokens = [];
let inMemoryPasswordResets = [];

// Generate JWT Access Token (short-lived)
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || "default-secret", {
        expiresIn: "15m" // Short-lived for security
    });
};

// Generate JWT Refresh Token (long-lived)
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || "default-refresh-secret", {
        expiresIn: "7d" // Long-lived
    });
};

// Generate JWT Token (legacy - for backward compatibility)
const generateToken = (userId) => {
    return generateAccessToken(userId);
};

// Register User
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check if user exists
        let existingUser;
        try {
            existingUser = await User.findOne({ email });
        } catch (err) {
            // MongoDB not available, check in-memory
            existingUser = inMemoryUsers.find(u => u.email === email);
        }

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Email already registered" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Supabase
        let newUser;
        try {
            if (!supabase) {
                throw new Error("Supabase not configured");
            }

            // Check if user exists in Supabase
            const { data: existingSupabaseUser } = await supabase
                .from("users")
                .select("id")
                .eq("email", email)
                .single();

            if (existingSupabaseUser) {
                return res.status(400).json({ 
                    success: false,
                    message: "Email already registered" 
                });
            }

            // Generate unique ID
            const userId = Date.now().toString();
            
            // Insert user into Supabase
            const { data: supabaseUser, error: supabaseError } = await supabase
                .from("users")
                .insert([{
                    id: userId,
                    full_name: fullName,
                    email,
                    password: hashedPassword,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (supabaseError) {
                console.error("Supabase insert error:", supabaseError);
                throw supabaseError;
            }

            newUser = {
                _id: supabaseUser.id,
                name: supabaseUser.full_name,
                email: supabaseUser.email,
                createdAt: supabaseUser.created_at
            };
            
            console.log("✅ User saved to Supabase");
        } catch (err) {
            console.error("Supabase error:", err.message);
            // Fallback to MongoDB
            try {
                newUser = await User.create({
                    name: fullName,
                    email,
                    password: hashedPassword
                });
                console.log("✅ User saved to MongoDB (fallback)");
            } catch (mongoErr) {
                // Last resort: in-memory
                newUser = {
                    _id: Date.now().toString(),
                    name: fullName,
                    email,
                    password: hashedPassword,
                    createdAt: new Date()
                };
                inMemoryUsers.push(newUser);
                console.log("⚠️ User saved to in-memory storage (Supabase and MongoDB not available)");
            }
        }

        // Generate tokens
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // Store refresh token
        try {
            await RefreshToken.create({
                token: refreshToken,
                userId: newUser._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });
        } catch (err) {
            // MongoDB not available, use in-memory
            inMemoryRefreshTokens.push({
                token: refreshToken,
                userId: newUser._id.toString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isRevoked: false
            });
        }

        // Send welcome email
        await emailService.sendWelcomeEmail(newUser.email, newUser.name);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                fullName: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ 
            success: false,
            message: "Registration failed",
            error: error.message 
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            });
        }

        // Find user in Supabase first
        let user;
        try {
            if (supabase) {
                const { data: supabaseUser, error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", email)
                    .single();

                if (supabaseUser) {
                    user = {
                        _id: supabaseUser.id,
                        name: supabaseUser.full_name,
                        email: supabaseUser.email,
                        password: supabaseUser.password,
                        createdAt: supabaseUser.created_at
                    };
                    console.log("✅ User found in Supabase");
                }
            }
        } catch (err) {
            console.log("Supabase lookup failed, trying MongoDB...");
        }

        // Fallback to MongoDB
        if (!user) {
            try {
                user = await User.findOne({ email });
                if (user) console.log("✅ User found in MongoDB");
            } catch (err) {
                // MongoDB not available, check in-memory
                user = inMemoryUsers.find(u => u.email === email);
                if (user) console.log("⚠️ User found in in-memory storage");
            }
        }

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store refresh token
        try {
            await RefreshToken.create({
                token: refreshToken,
                userId: user._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        } catch (err) {
            // MongoDB not available, use in-memory
            inMemoryRefreshTokens.push({
                token: refreshToken,
                userId: user._id.toString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isRevoked: false
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                fullName: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false,
            message: "Login failed",
            error: error.message 
        });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        let user;
        try {
            user = await User.findById(req.user.id).select("-password");
        } catch (err) {
            // MongoDB not available, check in-memory
            user = inMemoryUsers.find(u => u._id === req.user.id);
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
            user: {
                id: user._id,
                fullName: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get profile",
            error: error.message 
        });
    }
};

// Refresh Access Token
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ 
                success: false,
                message: "Refresh token is required" 
            });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "default-refresh-secret");
        } catch (err) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid or expired refresh token" 
            });
        }

        // Check if refresh token exists and is not revoked
        let storedToken;
        try {
            storedToken = await RefreshToken.findOne({ token: refreshToken, isRevoked: false });
        } catch (err) {
            // MongoDB not available, check in-memory
            storedToken = inMemoryRefreshTokens.find(t => t.token === refreshToken && !t.isRevoked);
        }

        if (!storedToken) {
            return res.status(401).json({ 
                success: false,
                message: "Refresh token not found or revoked" 
            });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);

        // Revoke old refresh token (token rotation)
        try {
            await RefreshToken.updateOne(
                { token: refreshToken },
                { isRevoked: true, revokedAt: new Date() }
            );
        } catch (err) {
            // In-memory
            const tokenIndex = inMemoryRefreshTokens.findIndex(t => t.token === refreshToken);
            if (tokenIndex !== -1) {
                inMemoryRefreshTokens[tokenIndex].isRevoked = true;
                inMemoryRefreshTokens[tokenIndex].revokedAt = new Date();
            }
        }

        // Store new refresh token
        try {
            await RefreshToken.create({
                token: newRefreshToken,
                userId: decoded.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        } catch (err) {
            inMemoryRefreshTokens.push({
                token: newRefreshToken,
                userId: decoded.id.toString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isRevoked: false
            });
        }

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({ 
            success: false,
            message: "Token refresh failed",
            error: error.message 
        });
    }
};

// Logout (Revoke Refresh Token)
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            // Revoke the refresh token
            try {
                await RefreshToken.updateOne(
                    { token: refreshToken },
                    { isRevoked: true, revokedAt: new Date() }
                );
            } catch (err) {
                // In-memory
                const tokenIndex = inMemoryRefreshTokens.findIndex(t => t.token === refreshToken);
                if (tokenIndex !== -1) {
                    inMemoryRefreshTokens[tokenIndex].isRevoked = true;
                }
            }
        }

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            success: false,
            message: "Logout failed",
            error: error.message 
        });
    }
};

// Forgot Password (Send Reset Email)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: "Email is required" 
            });
        }

        // Find user
        let user;
        try {
            user = await User.findOne({ email });
        } catch (err) {
            user = inMemoryUsers.find(u => u.email === email);
        }

        if (!user) {
            // Don't reveal if email exists (security)
            return res.status(200).json({
                success: true,
                message: "If that email exists, a password reset link has been sent"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Store reset token
        try {
            await PasswordReset.create({
                userId: user._id,
                email: user.email,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
            });
        } catch (err) {
            inMemoryPasswordResets.push({
                userId: user._id.toString(),
                email: user.email,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
                used: false
            });
        }

        // Send reset email
        await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

        res.status(200).json({
            success: true,
            message: "If that email exists, a password reset link has been sent"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to process password reset request",
            error: error.message 
        });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: "Token and new password are required" 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 6 characters" 
            });
        }

        // Hash the token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find reset token
        let resetRecord;
        try {
            resetRecord = await PasswordReset.findOne({
                token: hashedToken,
                used: false,
                expiresAt: { $gt: new Date() }
            });
        } catch (err) {
            resetRecord = inMemoryPasswordResets.find(r => 
                r.token === hashedToken && 
                !r.used && 
                new Date(r.expiresAt) > new Date()
            );
        }

        if (!resetRecord) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid or expired reset token" 
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        try {
            await User.updateOne(
                { _id: resetRecord.userId },
                { password: hashedPassword }
            );
        } catch (err) {
            const userIndex = inMemoryUsers.findIndex(u => u._id === resetRecord.userId);
            if (userIndex !== -1) {
                inMemoryUsers[userIndex].password = hashedPassword;
            }
        }

        // Mark token as used
        try {
            await PasswordReset.updateOne(
                { token: hashedToken },
                { used: true }
            );
        } catch (err) {
            const resetIndex = inMemoryPasswordResets.findIndex(r => r.token === hashedToken);
            if (resetIndex !== -1) {
                inMemoryPasswordResets[resetIndex].used = true;
            }
        }

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to reset password",
            error: error.message 
        });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, avatar } = req.body;
        const updates = {};

        if (fullName) updates.name = fullName;
        if (avatar) updates.avatar = avatar;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "No fields to update" 
            });
        }

        // Update user
        let updatedUser;
        try {
            updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                updates,
                { new: true }
            ).select("-password");
        } catch (err) {
            const userIndex = inMemoryUsers.findIndex(u => u._id === req.user.id);
            if (userIndex !== -1) {
                inMemoryUsers[userIndex] = { ...inMemoryUsers[userIndex], ...updates };
                const { password, ...userWithoutPassword } = inMemoryUsers[userIndex];
                updatedUser = userWithoutPassword;
            }
        }

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                fullName: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update profile",
            error: error.message 
        });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: "Current and new passwords are required" 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: "New password must be at least 6 characters" 
            });
        }

        // Find user
        let user;
        try {
            user = await User.findById(req.user.id);
        } catch (err) {
            user = inMemoryUsers.find(u => u._id === req.user.id);
        }

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: "Current password is incorrect" 
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        try {
            await User.updateOne(
                { _id: req.user.id },
                { password: hashedPassword }
            );
        } catch (err) {
            const userIndex = inMemoryUsers.findIndex(u => u._id === req.user.id);
            if (userIndex !== -1) {
                inMemoryUsers[userIndex].password = hashedPassword;
            }
        }

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to change password",
            error: error.message 
        });
    }
};
