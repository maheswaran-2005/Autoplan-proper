// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// controllers/auth.controller.js
// Simple auth (no real DB — just a placeholder)
// Add bcrypt + JWT + MongoDB for production
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    // TODO: check DB, verify password hash, return real JWT
    res.json({ success: true, message: 'Login placeholder — connect your DB' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' })
    }
    // TODO: hash password, save user to DB, return JWT
    res.status(201).json({ success: true, message: 'Register placeholder — connect your DB' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { login, register }
