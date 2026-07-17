const supabase = require("../config/supabase");

// Get User Settings
exports.getUserSettings = async (req, res) => {
    try {
        const { data: settings, error } = await supabase
            .from("user_settings")
            .select("*")
            .eq("user_id", req.user.id)
            .single();

        // If no settings exist, return defaults
        if (error && error.code === 'PGRST116') {
            return res.status(200).json({
                success: true,
                settings: {
                    emailNotifications: true,
                    soundNotifications: true,
                    desktopNotifications: true,
                    meetingReminders: true,
                    audioDevice: 'default',
                    videoDevice: 'default',
                    speakerDevice: 'default',
                    theme: 'dark',
                    language: 'en',
                    showOnlineStatus: true,
                    allowRecording: true
                }
            });
        }

        if (error) {
            throw error;
        }

        res.status(200).json({
            success: true,
            settings: settings || {}
        });

    } catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get settings",
            error: error.message
        });
    }
};

// Update User Settings
exports.updateUserSettings = async (req, res) => {
    try {
        const settingsData = {
            user_id: req.user.id,
            email_notifications: req.body.emailNotifications,
            sound_notifications: req.body.soundNotifications,
            desktop_notifications: req.body.desktopNotifications,
            meeting_reminders: req.body.meetingReminders,
            audio_device: req.body.audioDevice,
            video_device: req.body.videoDevice,
            speaker_device: req.body.speakerDevice,
            theme: req.body.theme,
            language: req.body.language,
            show_online_status: req.body.showOnlineStatus,
            allow_recording: req.body.allowRecording,
            updated_at: new Date().toISOString()
        };

        // Try to update first
        const { data: existing } = await supabase
            .from("user_settings")
            .select("id")
            .eq("user_id", req.user.id)
            .single();

        let result;
        if (existing) {
            // Update existing settings
            result = await supabase
                .from("user_settings")
                .update(settingsData)
                .eq("user_id", req.user.id)
                .select()
                .single();
        } else {
            // Insert new settings
            result = await supabase
                .from("user_settings")
                .insert([settingsData])
                .select()
                .single();
        }

        if (result.error) {
            throw result.error;
        }

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings: result.data
        });

    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update settings",
            error: error.message
        });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("id, full_name, email, avatar, created_at")
            .eq("id", req.user.id)
            .single();

        if (error) {
            throw error;
        }

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.created_at
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

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { displayName, avatar } = req.body;

        const updateData = {
            updated_at: new Date().toISOString()
        };

        if (displayName) {
            updateData.full_name = displayName;
        }

        if (avatar) {
            updateData.avatar = avatar;
        }

        const { data: user, error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", req.user.id)
            .select("id, full_name, email, avatar")
            .single();

        if (error) {
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                avatar: user.avatar
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
