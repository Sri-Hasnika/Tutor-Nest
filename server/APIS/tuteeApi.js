const exp=require('express');
const TuteeApp=exp.Router();
const {createTutee,tuteeDetails,tuteeDetailsById,updateTutee,deleteTutee,loginTutee, forgotPassword, resetPassword, searchTutees, filterTutees, resetPasswordHandler}=require('../controllers/tuteeControler');
const {bookDemoClass, getBookedDemoClasses, cancelDemoClass }=require('../controllers/demoClassControler');
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

//demo class routes
TuteeApp.post('/demo-class/book',bookDemoClass);
TuteeApp.get('/demo-class/booked/:tuteeId',getBookedDemoClasses);
TuteeApp.delete('/demo-class/booked/:id',cancelDemoClass);

module.exports=TuteeApp;
