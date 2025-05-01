const express = require("express")
const router = express.Router()
const sessionController = require("../controllers/sessionController")
const { authenticateTutor } = require("../middleware/auth")

// Get all sessions for a tutor with date filter
router.get("/tutor/:tutorId", authenticateTutor, sessionController.getSessionsByTutor)

// Get all sessions for a tutee with date filter
router.get("/tutee/:tuteeId", sessionController.getSessionsByTutee)

// Get a specific session by ID
router.get("/:id", sessionController.getSessionById)

// Create a new session
router.post("/", authenticateTutor, sessionController.createSession)

// Update a session
router.put("/:id", authenticateTutor, sessionController.updateSession)

// Delete a session
router.delete("/:id", authenticateTutor, sessionController.deleteSession)

module.exports = router
