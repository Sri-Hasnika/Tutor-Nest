
const path = require("path");
const fs = require("fs");
const tutee = require("../../Models/tuteeModel");
const TuteeProgress = require("../../Models/tuteeProgressModel");

/**
 * Uploads an assessment report for a tutee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadAssessmentReport = async (req, res) => {
  try {
    const { tuteeId } = req.params;
    const tutorId = req.user._id;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate tutee exists and belongs to this tutor
    const tuteeById = await tutee.findOne({ _id: tuteeId, tutorId: tutorId });
    if (!tuteeById) {
      // Delete the uploaded file if tutee is invalid
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(404).json({
        success: false,
        message: "Tutee not found or not assigned to this tutor",
      });
    }

    // Create report object
    const reportObj = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/reports/${path.basename(req.file.path)}`,
      uploadDate: new Date()
    };

    // Add report to tutee's progress
    const progress = await TuteeProgress.findOneAndUpdate(
      { tutorId, tuteeId },
      { 
        $push: { assessmentReports: reportObj },
      },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Report uploaded successfully",
      report: reportObj,
      progress: progress
    });
  } catch (error) {
    console.error("Error uploading assessment report:", error);
    
    // Delete the uploaded file in case of error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to upload assessment report",
      error: error.message,
    });
  }
};

module.exports = uploadAssessmentReport;