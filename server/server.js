const exp=require('express')
const app=exp()
const mongoose=require('mongoose')
const tutorApp=require('./APIS/tutorApi')
const TuteeApp=require('./APIS/tuteeApi');
//using port from .env
require('dotenv').config()
const port=process.env.PORT||9000

//user parser middleware
app.use(exp.json())
app.use('/tutor-api',tutorApp);
app.use('/tutee-api',TuteeApp); 


//connection
mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console.log(`server listening on port ${port} ....`))
    console.log('DB connection success')
})
.catch(err=>console.log("error in db connection",err));

