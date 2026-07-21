// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// controllers/plan.controller.js
// Business logic for plan routes.
// In a real app: replace in-memory array with DB.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// In-memory storage (replace with MongoDB/PostgreSQL later)
let plans = []

// POST /api/plan/save
const savePlan = async (req, res) => {
  try {
    const planData = req.body

    // Validate required fields
    if (!planData.plotL || !planData.plotW) {
      return res.status(400).json({ error: 'plotL and plotW are required' })
    }

    const newPlan = {
      id:        Date.now().toString(),
      ...planData,
      savedAt:   new Date().toISOString(),
    }

    plans.push(newPlan)
    res.status(201).json({ success: true, plan: newPlan, message: 'Plan saved!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/plan/list
const getPlans = async (req, res) => {
  try {
    res.json({ plans, count: plans.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/plan/:id
const deletePlan = async (req, res) => {
  try {
    const before = plans.length
    plans = plans.filter(p => p.id !== req.params.id)
    if (plans.length === before) {
      return res.status(404).json({ error: 'Plan not found' })
    }
    res.json({ success: true, message: 'Plan deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { savePlan, getPlans, deletePlan }
