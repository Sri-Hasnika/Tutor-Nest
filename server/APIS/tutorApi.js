const exp=require('express');
const tutorApp=exp.Router();
const {createTutor,getTutor,getTutorById,loginTutor,updateTutor,deleteTutor,forgotPassword,resetPasswordHandler,searchTutors,filterTutors}=require('../controllers/tutorController');
const { getBookedDemoRequests, addMeetLink } = require('../controllers/demoClassControler');
// const {scheduleDemoClass, getDemoClasses, deleteDemoClass}=require('../controllers/demoClassControler');


//body parser middleware
tutorApp.use(exp.json());

//create a new tutor
tutorApp.post('/signIn',createTutor)
tutorApp.get('/tutor',getTutor)
tutorApp.get('/tutor/:id',getTutorById)
tutorApp.put('/tutor/:id',updateTutor)
tutorApp.delete('/tutor/:id',deleteTutor)
//login tutor route
tutorApp.post('/tutor',loginTutor)

//forgot password or reset password for tutor
tutorApp.post('/forgot-password',forgotPassword)
tutorApp.post('/reset-password',resetPasswordHandler)

//search and filter routes
tutorApp.get('/search',searchTutors);
tutorApp.get('/filter',filterTutors);

// //demo class routes
// // Schedule a new demo class
// tutorApp.post('/demo-class', scheduleDemoClass);
// // Get all scheduled demo classes for a tutor
// tutorApp.get('/demo-class/:tutorId', getDemoClasses);
// // Delete a demo class
// tutorApp.delete('/demo-class/:id', deleteDemoClass);

tutorApp.get('/demo-class/:tutorId',getBookedDemoRequests);
tutorApp.put('/demo-class/:tutorId/:classId', addMeetLink);





module.exports=tutorApp;
