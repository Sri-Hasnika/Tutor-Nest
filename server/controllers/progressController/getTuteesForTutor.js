const tutee = require("../../Models/tuteeModel");

const getTuteesForTutor = async (req, res) => {
  try {

    const tutorId = req.user._id;

    const tutees = await tutee.find({ tutorId: tutorId })
      .select("firstName lastName email studying course")
      .sort({ firstName: 1 });

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
