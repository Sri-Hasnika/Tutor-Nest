const SessionPlan = require("../../Models/sessionPlanModel");
const tutee = require("../../Models/tuteeModel");
const TuteeProgress = require("../../Models/tuteeProgressModel");

const getTuteeProgress = async (req, res) => {
  try {
    const { tuteeId } = req.params;
    const tutorId = req.user._id;

    // Validate tutee exists and belongs to this tutor
    const tuteeById = await tutee.findOne({ _id: tuteeId, tutorId: tutorId });
    if (!tuteeById) {
      return res.status(404).json({
        success: false,
        message: "Tutee not found or not assigned to this tutor",
      });
    }``

    // Get the session plan to extract topics
    const sessionPlan = await SessionPlan.findOne({
      tutorId: tutorId,
      tuteeId: tuteeId,
      status: "active",
    });

    // Get existing progress or create a new object if none exists
    let progress = await TuteeProgress.findOne({
      tutorId: tutorId,
      tuteeId: tuteeId,
    });

    if (!progress) {
      // Return empty data structure if no progress record yet
      return res.status(200).json({
        success: true,
        progress: {
          tuteeId: tuteeId,
          tuteeName: `${tutee.firstName} ${tutee.lastName}`,
          tuteeDetails: {
            course: tutee.course,
            studying: tutee.studying,
          },
          completedTopics: [],
          pendingTopics: sessionPlan ? sessionPlan.topics : [],
          feedback: "",
          assessmentReports: [],
        },
      });
    }

    // Calculate pending topics (from session plan but not in completed topics)
    const completedTopicNames = progress.completedTopics.map(topic => topic.topicName);
    const pendingTopics = sessionPlan 
      ? sessionPlan.topics.filter(topic => !completedTopicNames.includes(topic))
      : [];

    return res.status(200).json({
      success: true,
      progress: {
        tuteeId: tuteeId,
        tuteeName: `${tutee.firstName} ${tutee.lastName}`,
        tuteeDetails: {
          course: tutee.course,
          studying: tutee.studying,
        },
        completedTopics: progress.completedTopics,
        pendingTopics: pendingTopics,
        feedback: progress.feedback,
        assessmentReports: progress.assessmentReports,
      },
    });
  } catch (error) {
    console.error("Error fetching tutee progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutee progress",
      error: error.message,
    });
  }
};

module.exports = getTuteeProgress;
