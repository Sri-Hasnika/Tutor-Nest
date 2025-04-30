const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { authenticateTutor } = require("../middleware/auth"); // Assuming you have auth middleware
const upload = require("../middleware/upload"); // Middleware for file uploads

// Get tutees for a tutor (for dropdown)
router.get("/tutees", authenticateTutor, progressController.getTuteesForTutor);

// Get progress for a specific tutee
router.get("/:tuteeId", authenticateTutor, progressController.getTuteeProgress);

// Create or update progress for a tutee
router.post("/save", authenticateTutor, progressController.saveTuteeProgress);

// Add completed topic
router.post("/topic/add", authenticateTutor, progressController.addCompletedTopic);

// Remove completed topic
router.delete("/topic/:tuteeId/:topicName", authenticateTutor, progressController.removeCompletedTopic);

// Update feedback
router.put("/feedback/:tuteeId", authenticateTutor, progressController.updateFeedback);

// Upload assessment report
router.post(
  "/upload/:tuteeId",
  authenticateTutor,
  upload.single("reportFile"),
  progressController.uploadAssessmentReport
);

// Generate report
router.get("/report/:tuteeId", authenticateTutor, progressController.generateReport);

module.exports = router;