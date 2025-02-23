const exp=require('express');
const tutorApp=exp.Router();
const {createTutor,getTutor,getTutorById,loginTutor,updateTutor,deleteTutor}=require('../controllers/tutorController')


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
module.exports=tutorApp;
