const express = require('express')
const router = express.Router()
const aiController = require('../controllers/aiController')
const auth = require('../middleware/auth')

router.post('/summary',      auth, aiController.generateSummary)
router.post('/action-items', auth, aiController.extractActionItems)
router.post('/chat',         auth, aiController.chat)
router.post('/transcript',   auth, aiController.saveTranscript)

module.exports = router
