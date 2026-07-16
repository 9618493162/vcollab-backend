const supabase = require("../config/supabase");

// Generate random 6-digit meeting ID
const generateMeetingId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create Meeting
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, scheduledDate, scheduledTime, type, passcode } = req.body;
        
        const meetingId = generateMeetingId();

        // Use correct field names based on database schema
        const { data: meeting, error } = await supabase
            .from("meetings")
            .insert([
                {
                    meeting_id: meetingId,
                    title: title || 'Quick Meeting',
                    description: description || '',
                    host_id: req.user.id,
                    status: type === 'instant' ? 'active' : 'scheduled',
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            throw error;
        }

        // Add host as participant
        const { error: participantError } = await supabase
            .from("meeting_participants")
            .insert([
                {
                    meeting_id: meeting.id,
                    user_id: req.user.id
                }
            ]);

        if (participantError) {
            console.error("Add participant error:", participantError);
            // Don't fail the whole request for this
        }

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            meeting: {
                id: meeting.id,
                meetingId: meeting.meeting_id,
                title: meeting.title,
                description: meeting.description,
                status: meeting.status,
                createdAt: meeting.created_at
            }
        });

    } catch (error) {
        console.error("Create meeting error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create meeting",
            error: error.message,
            details: error.details || error.hint || null
        });
    }
};

// Join Meeting
exports.joinMeeting = async (req, res) => {
    try {
        const { meetingId, passcode } = req.body;

        const { data: meeting, error } = await supabase
            .from("meetings")
            .select("*")
            .eq("meeting_id", meetingId)
            .single();

        if (error || !meeting) {
            return res.status(404).json({ 
                success: false,
                message: "Meeting not found" 
            });
        }

        // Check passcode for private meetings
        if (meeting.type === "Private" && meeting.passcode !== passcode) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid passcode" 
            });
        }

        // Check if already a participant
        const { data: existingParticipant } = await supabase
            .from("meeting_participants")
            .select("*")
            .eq("meeting_id", meeting.id)
            .eq("user_id", req.user.id)
            .single();

        // Add user to participants if not already added
        if (!existingParticipant) {
            await supabase
                .from("meeting_participants")
                .insert([
                    {
                        meeting_id: meeting.id,
                        user_id: req.user.id
                    }
                ]);
        }

        res.status(200).json({
            success: true,
            message: "Joined meeting successfully",
            meeting: {
                id: meeting.id,
                meetingId: meeting.meeting_id,
                title: meeting.title,
                description: meeting.description,
                date: meeting.date,
                time: meeting.time,
                type: meeting.type
            }
        });

    } catch (error) {
        console.error("Join meeting error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to join meeting",
            error: error.message 
        });
    }
};

// Get User's Meetings
exports.getMeetings = async (req, res) => {
    try {
        // Get meetings where user is host or participant
        const { data: participantMeetings } = await supabase
            .from("meeting_participants")
            .select("meeting_id")
            .eq("user_id", req.user.id);

        const meetingIds = participantMeetings?.map(p => p.meeting_id) || [];
        
        let query = supabase
            .from("meetings")
            .select("*")
            .order("created_at", { ascending: false });

        // Filter to meetings where user is host or participant
        if (meetingIds.length > 0) {
            query = query.or(`host_id.eq.${req.user.id},id.in.(${meetingIds.join(",")})`);
        } else {
            query = query.eq("host_id", req.user.id);
        }

        const { data: meetings, error } = await query;

        if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
            console.error("Get meetings error:", error);
            throw error;
        }

        // Transform meetings to match frontend expectations
        const transformedMeetings = (meetings || []).map(meeting => ({
            id: meeting.id,
            meetingId: meeting.meeting_id,
            title: meeting.title,
            description: meeting.description,
            status: meeting.status,
            createdAt: meeting.created_at,
            hostId: meeting.host_id,
            hostEmail: meeting.host_email
        }));

        res.status(200).json({
            success: true,
            count: transformedMeetings.length,
            meetings: transformedMeetings
        });

    } catch (error) {
        console.error("Get meetings error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get meetings",
            error: error.message 
        });
    }
};

// Get Meeting by ID
exports.getMeetingById = async (req, res) => {
    try {
        const { meetingId } = req.params;

        const { data: meeting, error } = await supabase
            .from("meetings")
            .select(`
                *,
                host:users!meetings_host_id_fkey(id, full_name, email)
            `)
            .eq("meeting_id", meetingId)
            .single();

        if (error || !meeting) {
            return res.status(404).json({ 
                success: false,
                message: "Meeting not found" 
            });
        }

        res.status(200).json({
            success: true,
            meeting
        });

    } catch (error) {
        console.error("Get meeting error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get meeting",
            error: error.message 
        });
    }
};
