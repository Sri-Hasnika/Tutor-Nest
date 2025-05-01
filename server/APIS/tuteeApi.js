const exp=require('express');
const TuteeApp=exp.Router();
const {createTutee,tuteeDetails,tuteeDetailsById,updateTutee,deleteTutee,loginTutee, forgotPassword, resetPassword, searchTutees, filterTutees, resetPasswordHandler}=require('../controllers/tuteeControler');
const { bookDemoClass, getBookedDemoClasses } = require('../controllers/demoClassControler');
const { authenticateTutor } = require('../middleware/auth');

//body parser middleware
TuteeApp.use(exp.json())


//create,get,update,delete a tutee(student or parent)
TuteeApp.post('/signIn',createTutee)//d
TuteeApp.get('/tutees',tuteeDetails)
TuteeApp.get('/tutees/:id',tuteeDetailsById)
TuteeApp.put('/update/:id',updateTutee)//d
TuteeApp.delete('/delete/:id',deleteTutee)

//login for tutee
TuteeApp.post('/login',loginTutee);//d
//forgot password and reset password 
TuteeApp.post('/forgot-password',forgotPassword);
TuteeApp.post('/reset-password',resetPasswordHandler);

//search and filter routes
TuteeApp.get('/search',searchTutees);
TuteeApp.get('/filter', filterTutees);


TuteeApp.post('/demo-class/book',bookDemoClass);
TuteeApp.get('/demo-class/booked/:tuteeId',getBookedDemoClasses);

TuteeApp.get("/tutor/:tutorId", authenticateTutor, async (req, res) => {
    try {
      const { tutorId } = req.params
  
      // Verify the authenticated tutor matches the requested tutorId
      if (req.user._id.toString() !== tutorId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to these tutees",
        })
      }
  
      const tutees = await require("../models/tutee")
        .find({
          tutorId,
        })
        .select("_id firstName lastName profileImage")
  
      return res.status(200).json({
        success: true,
        payload: tutees,
      })
    } catch (error) {
      console.error("Error fetching tutees:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to fetch tutees",
      })
    }
  })



module.exports=TuteeApp;
