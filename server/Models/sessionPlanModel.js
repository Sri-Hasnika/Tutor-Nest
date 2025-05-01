const mongoose = require("mongoose")

// Modify the existing SessionPlan model to include topics array
// This is based on the provided sessionPlanModel but with additional fields needed for our feature
const sessionPlanSchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tutor",
      required: true,
    },
    tuteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tutee",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    course: {
      type: String,
      required: true,
    }, // Course name or subject
    studentClass: {
      type: String,
      required: true,
    }, // Class or grade level
    topics: [String], // List of topics that will be covered in the sessions
    schedule: {
      daysPerWeek: {
        type: Number,
        required: true,
      }, // Number of sessions per week
      timings: [String], // Example: ["10:00 AM - 11:00 AM", "1:00 PM - 2:00 PM"]
    },
    durationWeeks: {
      type: Number,
      required: true,
    }, // Duration in weeks for the plan
    additionalNotes: {
      type: String,
      default: "",
    }, // Optional notes for the session
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    }, // Plan status
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

const SessionPlan = mongoose.model("SessionPlan", sessionPlanSchema)

module.exports = SessionPlan
