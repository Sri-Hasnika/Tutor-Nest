const exp=require('express');
const tutorApp=exp.Router();
const {createTutor,getTutor,getTutorById,loginTutor,updateTutor,deleteTutor,forgotPassword,resetPasswordHandler}=require('../controllers/tutorController')


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
tutorApp.get('/search',searchTutor);
module.exports=tutorApp;
