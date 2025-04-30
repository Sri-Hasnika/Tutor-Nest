const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")
const { generateText } = require("ai")
const { groq, createGroq } = require("@ai-sdk/groq")
const SessionPlan = require("../../Models/sessionPlanModel")
const TuteeProgress = require("../../Models/tuteeProgressModel")
const tutee = require("../../Models/tuteeModel")

/**
 * Generates an AI-enhanced PDF report of tutee's progress using Groq AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const groqWithKey = createGroq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

const generateReport = async (req, res) => {
  try {
    const { tuteeId } = req.params
    const tutorId = req.user._id

    // Validate tutee exists and belongs to this tutor
    const tuteeData = await tutee
      .findOne({ _id: tuteeId, tutorId: tutorId })
      .select("firstName lastName email studying course")

    if (!tuteeData) {
      return res.status(404).json({
        success: false,
        message: "Tutee not found or not assigned to this tutor",
      })
    }

    // Get session plan
    const sessionPlan = await SessionPlan.findOne({
      tutorId: tutorId,
      tuteeId: tuteeId,
      status: "active",
    })

    // Get progress data
    const progress = await TuteeProgress.findOne({
      tutorId: tutorId,
      tuteeId: tuteeId,
    })

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress data found for this tutee",
      })
    }

    // Calculate progress metrics
    let progressMetrics = {}
    if (sessionPlan && sessionPlan.topics && sessionPlan.topics.length > 0) {
      const totalTopics = sessionPlan.topics.length
      const completedCount = progress.completedTopics.length
      const progressPercentage = Math.round((completedCount / totalTopics) * 100)

      progressMetrics = {
        totalTopics,
        completedCount,
        progressPercentage,
      }
    }

    // Get pending topics
    let pendingTopics = []
    if (sessionPlan && sessionPlan.topics) {
      const completedTopicNames = progress.completedTopics.map((t) => t.topicName)
      pendingTopics = sessionPlan.topics.filter((topic) => !completedTopicNames.includes(topic))
    }

    // Prepare data for AI
    const aiData = {
      tuteeDetails: {
        name: `${tuteeData.firstName} ${tuteeData.lastName}`,
        email: tuteeData.email,
        course: tuteeData.course,
        gradeOrClass: tuteeData.studying,
      },
      completedTopics: progress.completedTopics || [],
      pendingTopics: pendingTopics || [],
      feedback: progress.feedback || "No feedback provided yet.",
      progressMetrics,
    }

    // Generate AI-enhanced report content
    const { text: aiReport } = await generateText({
      model: groqWithKey("llama3-70b-8192"),
      prompt: `
        Generate a comprehensive tutee progress report based on the following data:
        
        Tutee Details: ${JSON.stringify(aiData.tuteeDetails)}
        
        Completed Topics: ${JSON.stringify(aiData.completedTopics)}
        
        Pending Topics: ${JSON.stringify(aiData.pendingTopics)}
        
        Tutor Feedback: ${aiData.feedback}
        
        Progress Metrics: ${JSON.stringify(aiData.progressMetrics)}
        
        Please provide:
        1. A personalized introduction summarizing the tutee's overall progress
        2. An analysis of completed topics with insights on achievement pace
        3. Recommendations for approaching pending topics
        4. A conclusion with encouragement and next steps
        
        Format the response with clear section headers that can be used in a PDF report.
      `,
    })

    // Parse AI response into sections
    const sections = parseAIResponse(aiReport)

    // Create folder for reports if it doesn't exist
    const reportsDir = path.join(__dirname, "../../uploads/generated-reports")
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true })
    }

    // Generate filename
    const filename = `progress_report_${tuteeData.firstName}_${tuteeData.lastName}_${Date.now()}.pdf`
    const filePath = path.join(reportsDir, filename)

    // Create PDF document
    const doc = new PDFDocument()
    const stream = fs.createWriteStream(filePath)
    doc.pipe(stream)

    // Add content to PDF
    // Header
    doc.fontSize(25).text("Tutee Progress Report", { align: "center" })
    doc.moveDown()

    // Tutee Details
    doc.fontSize(14).text("Tutee Details:", { underline: true })
    doc.fontSize(12).text(`Name: ${tuteeData.firstName} ${tuteeData.lastName}`)
    doc.fontSize(12).text(`Email: ${tuteeData.email}`)
    doc.fontSize(12).text(`Course: ${tuteeData.course}`)
    doc.fontSize(12).text(`Grade/Class: ${tuteeData.studying}`)
    doc.moveDown()

    // AI-generated content
    Object.entries(sections).forEach(([title, content]) => {
      if (title && content) {
        doc.fontSize(14).text(title, { underline: true })
        doc.fontSize(12).text(content)
        doc.moveDown()
      }
    })

    // Completed Topics
    doc.fontSize(14).text("Completed Topics:", { underline: true })
    if (progress.completedTopics && progress.completedTopics.length > 0) {
      progress.completedTopics.forEach((topic, index) => {
        const date = new Date(topic.completedDate).toLocaleDateString()
        doc.fontSize(12).text(`${index + 1}. ${topic.topicName} (Completed on: ${date})`)
      })
    } else {
      doc.fontSize(12).text("No topics completed yet.")
    }
    doc.moveDown()

    // Pending Topics
    if (pendingTopics.length > 0 || pendingTopics.length === 0) {
      doc.fontSize(14).text("Pending Topics:", { underline: true })
      if (pendingTopics.length > 0) {
        pendingTopics.forEach((topic, index) => {
          doc.fontSize(12).text(`${index + 1}. ${topic}`)
        })
      } else {
        doc.fontSize(12).text("All topics completed!")
      }
      doc.moveDown()
    }

    // Progress metrics
    if (progressMetrics.totalTopics) {
      doc.fontSize(14).text("Progress Summary:", { underline: true })
      doc.fontSize(12).text(`Total Topics: ${progressMetrics.totalTopics}`)
      doc.fontSize(12).text(`Completed Topics: ${progressMetrics.completedCount}`)
      doc.fontSize(12).text(`Completion Rate: ${progressMetrics.progressPercentage}%`)
      doc.moveDown()
    }

    // Generate date
    doc.fontSize(10).text(`Report generated on: ${new Date().toLocaleDateString()}`, { align: "right" })

    // Finalize the PDF and end the stream
    doc.end()

    // Wait for the PDF to be fully written
    stream.on("finish", () => {
      // Send the file path as a response
      return res.status(200).json({
        success: true,
        message: "AI-enhanced report generated successfully",
        reportUrl: `/uploads/generated-reports/${filename}`,
      })
    })

    // Handle stream errors
    stream.on("error", (err) => {
      console.error("Stream error:", err)
      return res.status(500).json({
        success: false,
        message: "Error generating PDF report",
        error: err.message,
      })
    })
  } catch (error) {
    console.error("Error generating report:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    })
  }
}

/**
 * Parse AI response into sections
 * @param {string} aiResponse - The AI-generated report text
 * @returns {Object} - Object with section titles as keys and content as values
 */
function parseAIResponse(aiResponse) {
  const sections = {}

  // Simple parsing logic - can be enhanced based on AI output format
  const lines = aiResponse.split("\n")
  let currentSection = "Introduction"
  let currentContent = []

  for (const line of lines) {
    // Check if line is a section header (simple heuristic)
    if (line.trim() && (line.includes(":") || /^[A-Z][\w\s]{2,25}$/.test(line.trim()))) {
      // Save previous section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join("\n")
      }

      // Start new section
      currentSection = line.trim()
      currentContent = []
    } else if (line.trim()) {
      currentContent.push(line)
    }
  }

  // Save the last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join("\n")
  }

  return sections
}

module.exports = generateReport
