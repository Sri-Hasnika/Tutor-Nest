const exp=require('express')
const app=exp()
const mongoose=require('mongoose')
const tutorApp=require('./APIS/tutorApi')
const TuteeApp=require('./APIS/tuteeApi');
const sessionPlanApi= require('./APIS/sessionPlanApi');
const progressApi= require('./APIS/progressApi');
const path = require("path")
const cors = require('cors')

require('dotenv').config()
const port=process.env.PORT||9000


app.use(cors({origin: "http://localhost:3000"}))

//user parser middleware
app.use(exp.json())
app.use('/tutor-api',tutorApp);
app.use('/tutee-api',TuteeApp); 
app.use('/sessionPlan-api', sessionPlanApi)
app.use('/progress-api', progressApi);

app.use("/uploads", exp.static(path.join(__dirname, "uploads")))

//connection
mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console.log(`server listening on port ${port} ....`))
    console.log('DB connection success')
})
.catch(err=>console.log("error in db connection",err));

