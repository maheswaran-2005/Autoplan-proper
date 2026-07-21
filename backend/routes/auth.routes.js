// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// routes/auth.routes.js
// URL paths for /api/auth/...
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const router = require('express').Router()
const { login, register } = require('../controllers/auth.controller')

router.post('/login',    login)     // POST /api/auth/login
router.post('/register', register)  // POST /api/auth/register

module.exports = router
