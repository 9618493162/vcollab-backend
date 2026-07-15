const supabase = require("../config/supabase");

// Generate random 6-digit meeting ID
const generateMeetingId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create Meeting
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, date, time, type, passcode } = req.body;
        
        const meetingId = generateMeetingId();

        const { data: meeting, error } = await supabase
            .from("meetings")
            .insert([
                {
                    meeting_id: meetingId,
                    title,
                    description,
                    host_id: req.user.id,
                    date,
                    time,
                    type: type || "Public",
                    passcode: passcode || "",
                    status: "scheduled",
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Add host as participant
        await supabase
            .from("meeting_participants")
            .insert([
                {
                    meeting_id: meeting.id,
                    user_id: req.user.id
                }
            ]);

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
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
        console.error("Create meeting error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create meeting",
            error: error.message 
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

        const { data: meetings, error } = await supabase
            .from("meetings")
            .select(`
                *,
                host:users!meetings_host_id_fkey(id, full_name, email)
            `)
            .or(`host_id.eq.${req.user.id},id.in.(${meetingIds.join(",")})`)
            .order("date", { ascending: false });

        if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
            throw error;
        }

        res.status(200).json({
            success: true,
            count: meetings?.length || 0,
            meetings: meetings || []
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
