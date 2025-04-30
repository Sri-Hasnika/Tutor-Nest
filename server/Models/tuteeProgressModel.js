const mongoose = require("mongoose");

const tuteeProgressSchema = new mongoose.Schema(
  {
    tutorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "tutor", 
      required: true 
    },
    tuteeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "tutee", 
      required: true 
    },
    completedTopics: [
      {
        topicName: { type: String, required: true },
        completedDate: { type: Date, default: Date.now }
      }
    ],
    feedback: { 
      type: String,
      default: ""
    },
    assessmentReports: [
      {
        fileName: { type: String },
        fileUrl: { type: String },
        uploadDate: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// Compound index to ensure a tutee has only one progress record per tutor
tuteeProgressSchema.index({ tutorId: 1, tuteeId: 1 }, { unique: true });

const TuteeProgress = mongoose.model("TuteeProgress", tuteeProgressSchema);

module.exports = TuteeProgress;