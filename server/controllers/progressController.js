// Import all controller functions
const getTuteesForTutor = require('./progressController/getTuteesForTutor');
const getTuteeProgress = require('./progressController/getTuteeProgress');
const saveTuteeProgress = require('./progressController/saveTuteeProgress');
const addCompletedTopic = require('./progressController/addCompletedTopic');
const removeCompletedTopic = require('./progressController/removeCompletedTopic');
const updateFeedback = require('./progressController/updateFeedback');
const uploadAssessmentReport = require('./progressController/uploadAssessmentReport');
const generateReport = require('./progressController/generateReport');

// Export all controller functions
module.exports = {
  getTuteesForTutor,
  getTuteeProgress,
  saveTuteeProgress,
  addCompletedTopic,
  removeCompletedTopic,
  updateFeedback,
  uploadAssessmentReport,
  generateReport
};