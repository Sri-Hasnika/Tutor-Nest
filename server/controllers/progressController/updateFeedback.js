const tutee = require("../../Models/tuteeModel");
const TuteeProgress = require("../../Models/tuteeProgressModel");

/**
 * Updates feedback for a tutee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateFeedback = async (req, res) => {
  try {
    const { tuteeId } = req.params;
    const { feedback } = req.body;
    const tutorId = req.user._id;

    if (!feedback && feedback !== "") {
      return res.status(400).json({
        success: false,
        message: "Feedback is required",
      });
    }

    // Validate tutee exists and belongs to this tutor
    const tuteeById = await tutee.findOne({ _id: tuteeId, tutorId: tutorId });
    if (!tuteeById) {
      return res.status(404).json({
        success: false,
        message: "Tutee not found or not assigned to this tutor",
      });
    }

    // Update progress document with new feedback
    const progress = await TuteeProgress.findOneAndUpdate(
      { tutorId, tuteeId },
      { feedback: feedback },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      progress: progress
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update feedback",
      error: error.message,
    });
  }
};

module.exports = updateFeedback;