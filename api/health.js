// Simple health check endpoint without middleware
module.exports = (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'VCollab Backend API',
        version: '1.0.0'
    });
};
