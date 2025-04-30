const tutee = require("../../Models/tuteeModel");
const TuteeProgress = require("../../Models/tuteeProgressModel");

/**
 * Adds a new completed topic to a tutee's progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addCompletedTopic = async (req, res) => {
  try {
    const { tuteeId, topicName } = req.body;
    const tutorId = req.user._id;

    if (!tuteeId || !topicName) {
      return res.status(400).json({
        success: false,
        message: "Tutee ID and topic name are required",
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

    // Create the new topic object
    const newTopic = {
      topicName: topicName,
      completedDate: new Date()
    };

    // Update progress document - add to completedTopics array
    const progress = await TuteeProgress.findOneAndUpdate(
      { tutorId, tuteeId },
      { 
        $push: { completedTopics: newTopic },
      },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Topic added successfully",
      progress: progress
    });
  } catch (error) {
    console.error("Error adding completed topic:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add completed topic",
      error: error.message,
    });
  }
};

module.exports = addCompletedTopic;