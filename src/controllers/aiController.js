const OpenAI = require('openai')

// Lazy-init so server starts even without OPENAI_API_KEY
let openai = null
function getClient() {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set')
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }
    return openai
}

// ── Generate meeting summary ─────────────────────────────────────────────────
exports.generateSummary = async (req, res) => {
    try {
        const { transcript, meetingTitle = 'Meeting' } = req.body
        if (!transcript || transcript.trim().length < 20) {
            return res.status(400).json({ success: false, message: 'Transcript too short' })
        }

        const client = getClient()
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an expert meeting summarizer. Write concise, structured summaries in markdown. ' +
                        'Format: ## Summary (2-3 sentences), ## Key Points (bullet list), ## Decisions Made (bullet list). ' +
                        'Be brief and professional.',
                },
                {
                    role: 'user',
                    content: `Summarize this meeting titled "${meetingTitle}":\n\n${transcript.slice(0, 8000)}`,
                },
            ],
            max_tokens: 600,
            temperature: 0.3,
        })

        res.json({
            success: true,
            summary: completion.choices[0].message.content,
        })
    } catch (err) {
        console.error('Summary error:', err.message)
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── Extract action items ─────────────────────────────────────────────────────
exports.extractActionItems = async (req, res) => {
    try {
        const { transcript } = req.body
        if (!transcript || transcript.trim().length < 20) {
            return res.status(400).json({ success: false, message: 'Transcript too short' })
        }

        const client = getClient()
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'Extract action items from the meeting transcript. ' +
                        'Return a JSON array of objects with keys: ' +
                        '"task" (string), "assignee" (string or null), "deadline" (string or null), "priority" (high|medium|low). ' +
                        'Only return valid JSON, no markdown.',
                },
                {
                    role: 'user',
                    content: `Extract action items:\n\n${transcript.slice(0, 8000)}`,
                },
            ],
            max_tokens: 800,
            temperature: 0.1,
        })

        let items = []
        try {
            const raw = completion.choices[0].message.content.trim()
            // Strip markdown code fences if present
            const clean = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
            items = JSON.parse(clean)
        } catch {
            items = [{ task: completion.choices[0].message.content, assignee: null, deadline: null, priority: 'medium' }]
        }

        res.json({ success: true, items })
    } catch (err) {
        console.error('Action items error:', err.message)
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── Meeting-aware chatbot ────────────────────────────────────────────────────
exports.chat = async (req, res) => {
    try {
        const { messages, transcript, meetingTitle = 'this meeting' } = req.body
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ success: false, message: 'messages array required' })
        }

        const client = getClient()
        const systemPrompt =
            `You are an AI copilot assistant for a video meeting called "${meetingTitle}". ` +
            'You help participants by answering questions, clarifying points discussed, and providing insights. ' +
            'Be concise and helpful. ' +
            (transcript
                ? `\n\nMeeting transcript so far:\n${transcript.slice(0, 4000)}`
                : '\n\nNo transcript available yet.')

        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.slice(-10), // keep last 10 turns to save tokens
            ],
            max_tokens: 400,
            temperature: 0.7,
        })

        res.json({
            success: true,
            reply: completion.choices[0].message.content,
        })
    } catch (err) {
        console.error('Chat error:', err.message)
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── Save transcript (store in memory; extend to DB later) ────────────────────
const transcripts = new Map() // meetingId → transcript string

exports.saveTranscript = async (req, res) => {
    try {
        const { meetingId, text } = req.body
        if (!meetingId || !text) {
            return res.status(400).json({ success: false, message: 'meetingId and text required' })
        }
        const existing = transcripts.get(meetingId) || ''
        transcripts.set(meetingId, existing + '\n' + text)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}
