const exp=require('express');
const TuteeApp=exp.Router();
const {createTutee,tuteeDetails,tuteeDetailsById,updateTutee,deleteTutee,loginTutee, forgotPassword, resetPasswordHandler}=require('../controllers/tuteeControler');
//body parser middleware
TuteeApp.use(exp.json())


//create,get,update,delete a tutee(student or parent)
TuteeApp.post('/signIn',createTutee)
TuteeApp.get('/tutees',tuteeDetails)
TuteeApp.get('/tutees/:id',tuteeDetailsById)
TuteeApp.put('/update/:email',updateTutee)
TuteeApp.delete('/delete/:id',deleteTutee)

//login for tutee
TuteeApp.post('/login',loginTutee);
//forgot password and reset password 
TuteeApp.post('/forgot-password',forgotPassword);
TuteeApp.post('/reset-password',resetPasswordHandler);
//re


module.exports=TuteeApp;
