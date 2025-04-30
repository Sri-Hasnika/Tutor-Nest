const tutee = require("../../Models/tuteeModel");
const TuteeProgress = require("../../Models/tuteeProgressModel");

/**
 * Removes a completed topic from a tutee's progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeCompletedTopic = async (req, res) => {
  try {
    const { tuteeId, topicName } = req.params;
    const tutorId = req.user._id;

    // Validate tutee exists and belongs to this tutor
    const tuteeById = await tutee.findOne({ _id: tuteeId, tutorId: tutorId });
    if (!tuteeById) {
      return res.status(404).json({
        success: false,
        message: "Tutee not found or not assigned to this tutor",
      });
    }

    // Update progress document - remove from completedTopics array
    const progress = await TuteeProgress.findOneAndUpdate(
      { tutorId, tuteeId },
      { 
        $pull: { completedTopics: { topicName: topicName } },
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress record found for this tutee",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic removed successfully",
      progress: progress
    });
  } catch (error) {
    console.error("Error removing completed topic:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove completed topic",
      error: error.message,
    });
  }
};

module.exports = removeCompletedTopic;