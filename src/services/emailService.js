const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

const initTransporter = () => {
    if (transporter) return transporter;

    // Check if email is configured
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
        console.log('⚠️ Email service not configured - emails will be logged only');
        return null;
    }

    try {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        console.log('✅ Email service configured');
        return transporter;
    } catch (error) {
        console.error('⚠️ Email service initialization failed:', error.message);
        return null;
    }
};

// Send email wrapper with fallback
const sendEmail = async (to, subject, html, text) => {
    const emailTransporter = initTransporter();
    
    if (!emailTransporter) {
        // Log email instead of sending (for development)
        console.log('\n📧 EMAIL (Not Sent - Service Not Configured):');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text || html}`);
        console.log('---\n');
        return { success: true, message: 'Email logged (service not configured)' };
    }

    try {
        await emailTransporter.sendMail({
            from: process.env.EMAIL_FROM || 'VCollab <noreply@vcollab.com>',
            to,
            subject,
            text,
            html
        });
        console.log(`✅ Email sent to ${to}`);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        // Log email as fallback
        console.log('\n📧 EMAIL (Failed to send):');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text || html}`);
        console.log('---\n');
        return { success: false, message: error.message };
    }
};

// Welcome email template
const sendWelcomeEmail = async (email, name) => {
    const subject = 'Welcome to VCollab!';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a73e8;">Welcome to VCollab, ${name}!</h1>
            <p>Thank you for joining VCollab - your professional video conferencing platform.</p>
            <p>You can now:</p>
            <ul>
                <li>Create instant meetings</li>
                <li>Schedule meetings for later</li>
                <li>Invite participants</li>
                <li>Use AI-powered features</li>
                <li>Record and share meetings</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/dashboard-dark.html" 
               style="display: inline-block; padding: 12px 24px; background: #1a73e8; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                Go to Dashboard
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you have any questions, feel free to reach out to our support team.
            </p>
        </div>
    `;
    const text = `Welcome to VCollab, ${name}! You can now create and join meetings at ${process.env.FRONTEND_URL}`;
    
    return await sendEmail(email, subject, html, text);
};

// Password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;
    const subject = 'Reset Your VCollab Password';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a73e8;">Reset Your Password</h1>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password for your VCollab account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 12px 24px; background: #1a73e8; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                Reset Password
            </a>
            <p style="color: #666;">Or copy and paste this link in your browser:</p>
            <p style="color: #1a73e8; word-break: break-all;">${resetUrl}</p>
            <p style="color: #e63946; margin-top: 20px;">
                <strong>This link will expire in 1 hour.</strong>
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you didn't request this, please ignore this email. Your password will remain unchanged.
            </p>
        </div>
    `;
    const text = `Reset your VCollab password: ${resetUrl} (expires in 1 hour)`;
    
    return await sendEmail(email, subject, html, text);
};

// Meeting invitation email
const sendMeetingInvite = async (email, meetingDetails) => {
    const { title, meetingId, hostName, date, time, joinUrl } = meetingDetails;
    const subject = `Meeting Invitation: ${title}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a73e8;">You're Invited to a Meeting</h1>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin: 0 0 10px 0;">${title}</h2>
                <p style="margin: 5px 0;"><strong>Host:</strong> ${hostName}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
                <p style="margin: 5px 0;"><strong>Meeting ID:</strong> ${meetingId}</p>
            </div>
            <a href="${joinUrl}" 
               style="display: inline-block; padding: 12px 24px; background: #1a73e8; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                Join Meeting
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Or enter the meeting ID manually: ${meetingId}
            </p>
        </div>
    `;
    const text = `Join meeting: ${title}\nMeeting ID: ${meetingId}\nJoin: ${joinUrl}`;
    
    return await sendEmail(email, subject, html, text);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendMeetingInvite
};
