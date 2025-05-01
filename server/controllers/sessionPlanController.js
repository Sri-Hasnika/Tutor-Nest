
const expressAsyncHandler = require("express-async-handler");
const SessionPlan = require("../Models/sessionPlanModel");

// Create a new session plan
const createSessionPlan = expressAsyncHandler(async (req, res) => {
  const { tutorId, tuteeId, topics, schedule, durationWeeks, additionalNotes,course } = req.body;
  // console.log(req.body);

  // Validate input
  if (!tutorId || !tuteeId || !topics || !schedule || !durationWeeks) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // console.log("entering...")
    const newSessionPlan = new SessionPlan({
      ...req.body,
    });
    // console.log("passing");

    const savedSessionPlan = await newSessionPlan.save();
    // console.log("passing");
    res.status(201).json({ message: "Session plan created successfully", payload: savedSessionPlan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch session plans for a tutor or a tutee
const getSessionPlans = expressAsyncHandler(async (req, res) => {
  const { tutorId, tuteeId } = req.query;

  if (!tutorId && !tuteeId) {
    return res.status(400).json({ message: "Either tutorId or tuteeId must be provided" });
  }

  let filter = {};
  if (tutorId) filter.tutorId = tutorId;
  if (tuteeId) filter.tuteeId = tuteeId;

  try {
    const sessionPlans = await SessionPlan.find(filter).populate("tutorId").populate("tuteeId");
    res.status(200).json({ message: "Session plans fetched successfully", payload: sessionPlans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getSessionPlanById = async(req,res)=>{
    const { id } = req.params;
    
    try {
        const sessionPlan = await SessionPlan.findById(id);
        if (sessionPlan) {
        res.status(200).json({ message: "Session plan fetched successfully", payload: sessionPlan });
        } else {
        res.status(404).json({ message: "Session plan not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update session plan (e.g., status change, additional notes)
const updateSessionPlan = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  // console.log(updateData);

  try {
    const updatedPlan = await SessionPlan.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    // console.log(updatedPlan);
    if (updatedPlan) {
      res.status(200).json({ message: "Session plan updated successfully", payload: updatedPlan });
    } else {
      res.status(404).json({ message: "Session plan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all session plans for a tutor
const getSessionPlansByTutor = expressAsyncHandler(async (req, res) => {
  try {
    const { tutorId } = req.params;

    // Verify the authenticated tutor matches the requested tutorId
    if (req.user._id.toString() !== tutorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to these session plans",
      });
    }

    const sessionPlans = await SessionPlan.find({ tutorId, isActive: true });

    return res.status(200).json({
      success: true,
      payload: sessionPlans,
    });
  } catch (error) {
    console.error("Error fetching session plans:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch session plans",
    });
  }
});

// Get all session plans for a tutee
const getSessionPlansByTutee = expressAsyncHandler(async (req, res) => {
  try {
    const { tuteeId } = req.params;

    const sessionPlans = await SessionPlan.find({ tuteeId, isActive: true }).populate(
      "tutorId",
      "firstName lastName profileImage"
    );

    return res.status(200).json({
      success: true,
      payload: sessionPlans,
    });
  } catch (error) {
    console.error("Error fetching session plans:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch session plans",
    });
  }
});

module.exports = {
  createSessionPlan,
  getSessionPlans,
  updateSessionPlan,
  getSessionPlanById,
  getSessionPlansByTutor,
  getSessionPlansByTutee
};
