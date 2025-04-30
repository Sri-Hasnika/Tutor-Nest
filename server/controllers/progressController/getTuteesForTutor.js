// const Tutee = require("../../models/tuteeModel");

const tutee = require("../../Models/tuteeModel");

/**
 * Retrieves all tutees assigned to the logged-in tutor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTuteesForTutor = async (req, res) => {
  try {
    // Get tutor ID from authenticated user
    const tutorId = req.user._id;
    console.log(tutorId)

    // Find all tutees assigned to this tutor
    const tutees = await tutee.find({ tutorId: tutorId })
      .select("firstName lastName email studying course")
      .sort({ firstName: 1 }); // Sort alphabetically by first name

    if (!tutees || tutees.length === 0) {
      return res.status(200).json({ success: true, tutees: [] });
    }

    return res.status(200).json({
      success: true,
      tutees: tutees,
    });
  } catch (error) {
    console.error("Error fetching tutees:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutees",
      error: error.message,
    });
  }
};

module.exports = getTuteesForTutor;
