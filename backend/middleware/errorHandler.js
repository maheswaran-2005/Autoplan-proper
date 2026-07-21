// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// middleware/errorHandler.js
// Catches any unhandled error in the app.
// Must be the LAST app.use() in server.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports = (err, req, res, next) => {
  console.error('❌ Error:', err.message)
  res.status(err.status || 500).json({
    error:   err.message || 'Internal server error',
    path:    req.path,
    method:  req.method,
  })
}
