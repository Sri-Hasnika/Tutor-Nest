const mongoose = require("mongoose")

const sessionSchema = new mongoose.Schema(
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
    sessionPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SessionPlan",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    meetLink: {
      type: String,
      required: true,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

// Create compound index for efficient querying by date
sessionSchema.index({ tutorId: 1, scheduledTime: 1 })
sessionSchema.index({ tuteeId: 1, scheduledTime: 1 })

const Session = mongoose.model("Session", sessionSchema)

module.exports = Session
