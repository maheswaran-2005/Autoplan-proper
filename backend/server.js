// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// server.js — Main Express server
// This file ONLY sets up the server.
// All route logic is in routes/ and controllers/
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const app  = express()
const PORT = process.env.PORT || 5000

// Middleware — runs on every request
app.use(cors())            // allow frontend to call this server
app.use(express.json())    // parse JSON request bodies

// Routes — plug in route files here
app.use('/api/plan', require('./routes/plan.routes'))
app.use('/api/auth', require('./routes/auth.routes'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Error handler (always last)
app.use(require('./middleware/errorHandler'))

app.listen(PORT, () => {
  console.log(`✅ Server running → http://localhost:${PORT}`)
})
