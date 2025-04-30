const tutee = require("../../Models/tuteeModel");
const TuteeProgress = require("../../Models/tuteeProgressModel");

/**
 * Creates or updates progress information for a tutee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const saveTuteeProgress = async (req, res) => {
  try {
    const { tuteeId, completedTopics, feedback } = req.body;
    const tutorId = req.user._id;

    // Validate tutee exists and belongs to this tutor
    const tuteeById = await tutee.findOne({ _id: tuteeId, tutorId: tutorId });
    if (!tuteeById) {
      return res.status(404).json({
        success: false,
        message: "Tutee not found or not assigned to this tutor",
      });
    }

    // Format completed topics if provided
    let formattedCompletedTopics;
    if (completedTopics && Array.isArray(completedTopics)) {
      formattedCompletedTopics = completedTopics.map(topic => {
        // If topic is just a string, convert to proper format
        if (typeof topic === 'string') {
          return {
            topicName: topic,
            completedDate: new Date()
          };
        }
        // If topic already has the right format, use it as is
        return topic;
      });
    }

    // Find existing progress record or create a new one
    const updateData = {};
    if (formattedCompletedTopics) updateData.completedTopics = formattedCompletedTopics;
    if (feedback !== undefined) updateData.feedback = feedback;

    const progress = await TuteeProgress.findOneAndUpdate(
      { tutorId, tuteeId },
      updateData,
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Tutee progress saved successfully",
      progress: progress
    });
  } catch (error) {
    console.error("Error saving tutee progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save tutee progress",
      error: error.message,
    });
  }
};

module.exports = saveTuteeProgress;