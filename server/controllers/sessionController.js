const Session = require("../Models/sessionModel")
const SessionPlan = require("../Models/sessionPlanModel")
const tutee = require("../Models/tuteeModel")

// Get all sessions for a tutor with optional date filter
exports.getSessionsByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params
    const { date } = req.query

    // Verify the authenticated tutor matches the requested tutorId
    if (req.user._id.toString() !== tutorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to these sessions",
      })
    }

    const query = { tutorId }

    if (date) {
      // Create start and end date for the given date
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query.scheduledTime = {
        $gte: startDate,
        $lte: endDate,
      }
    }

    const sessions = await Session.find(query)
      .populate("tutorId", "firstName lastName profileImage")
      .populate("tuteeId", "firstName lastName")
      .populate("sessionPlanId", "title description")
      .sort({ scheduledTime: 1 })

    return res.status(200).json({
      success: true,
      payload: sessions,
    })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    })
  }
}

// Get all sessions for a tutee with optional date filter
exports.getSessionsByTutee = async (req, res) => {
  try {
    const { tuteeId } = req.params
    const { date } = req.query

    const query = { tuteeId }

    if (date) {
      // Create start and end date for the given date
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query.scheduledTime = {
        $gte: startDate,
        $lte: endDate,
      }
    }

    const sessions = await Session.find(query)
      .populate("tutorId", "firstName lastName profileImage")
      .populate("tuteeId", "firstName lastName")
      .populate("sessionPlanId", "title description")
      .sort({ scheduledTime: 1 })

    return res.status(200).json({
      success: true,
      payload: sessions,
    })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    })
  }
}

// Get a specific session by ID
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params

    const session = await Session.findById(id)
      .populate("tutorId", "firstName lastName profileImage")
      .populate("tuteeId", "firstName lastName")
      .populate("sessionPlanId", "title description topics")

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      })
    }

    return res.status(200).json({
      success: true,
      payload: session,
    })
  } catch (error) {
    console.error("Error fetching session:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch session",
    })
  }
}

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { tutorId, tuteeId, sessionPlanId, title, topic, meetLink, scheduledTime } = req.body

    // Verify the authenticated tutor matches the requested tutorId
    if (req.user._id.toString() !== tutorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to create sessions for this tutor",
      })
    }

    // Validate required fields
    if (!tutorId || !tuteeId || !sessionPlanId || !title || !topic || !meetLink || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    // Verify the session plan exists and belongs to this tutor
    const sessionPlan = await SessionPlan.findOne({
      _id: sessionPlanId,
      tutorId,
    })

    if (!sessionPlan) {
      return res.status(404).json({
        success: false,
        message: "Session plan not found or does not belong to this tutor",
      })
    }

    // Verify the tutee exists and is assigned to this tutor
    const tuteeById = await tutee.findOne({
      _id: tuteeId,
      tutorId,
    })

    if (!tuteeById) {
      return res.status(404).json({
        success: false,
        message: "Tutee not found or not assigned to this tutor",
      })
    }

    const newSession = new Session({
      tutorId,
      tuteeId,
      sessionPlanId,
      title,
      topic,
      meetLink,
      scheduledTime,
      status: "scheduled",
    })

    await newSession.save()

    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      payload: newSession,
    })
  } catch (error) {
    console.error("Error creating session:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create session",
    })
  }
}

// Update a session
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Find the session first to check permissions
    const session = await Session.findById(id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      })
    }

    // Verify the authenticated tutor matches the session's tutorId
    if (req.user._id.toString() !== session.tutorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this session",
      })
    }

    const updatedSession = await Session.findByIdAndUpdate(id, { $set: updateData }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Session updated successfully",
      payload: updatedSession,
    })
  } catch (error) {
    console.error("Error updating session:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update session",
    })
  }
}

// Delete a session
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params

    // Find the session first to check permissions
    const session = await Session.findById(id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      })
    }

    // Verify the authenticated tutor matches the session's tutorId
    if (req.user._id.toString() !== session.tutorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this session",
      })
    }

    await Session.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting session:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to delete session",
    })
  }
}
