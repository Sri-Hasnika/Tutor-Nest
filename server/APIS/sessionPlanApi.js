const express = require("express");
const router = express.Router();
const {
  getSessionPlanById,
  createSessionPlan,
  getSessionPlans,
  updateSessionPlan
} = require("../controllers/sessionPlanController");

// Route to create a new session plan
router.post("/create", createSessionPlan);

// Route to get session plans for a specific tutor or tutee
router.get("/", getSessionPlans);
router.get("/:id",getSessionPlanById)

// Route to update a session plan (status, notes, etc.)
router.put("/:id", updateSessionPlan);

module.exports = router;
