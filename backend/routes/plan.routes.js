// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// routes/plan.routes.js
// Defines URL paths for /api/plan/...
// Calls controller functions — no logic here.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const router = require('express').Router()
const { savePlan, getPlans, deletePlan } = require('../controllers/plan.controller')

router.post('/save',       savePlan)    // POST   /api/plan/save
router.get('/list',        getPlans)    // GET    /api/plan/list
router.delete('/:id',      deletePlan)  // DELETE /api/plan/123

module.exports = router
