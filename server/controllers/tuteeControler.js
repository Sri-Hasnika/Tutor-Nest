const expressAsyncHandler=require('express-async-handler');
const tutee=require('../Models/tuteeModel');
const bcrypt=require('bcrypt');
const {generateToken,validateTutee,generateResetToken,sendResetEmail,resetPassword}=require('../utils/authUtil');


//create a new tutee
const createTutee=expressAsyncHandler(async(req,res)=>{
    const newTutee=req.body;
    const newTuteeObj=tutee(newTutee);
    //hash the password
    const hashedpassword=await bcrypt.hash(newTuteeObj.password,10);
    newTuteeObj.password=hashedpassword;

    const TuteeObj=await newTuteeObj.save();
    res.status(201).send({message:"tutees",payload:TuteeObj})
    })

//get tutee details
const tuteeDetails=expressAsyncHandler(async(req,res)=>{
    const tutees=await tutee.find();
    res.send({message:"all tutees",payload:tutees})
})

//get tutee details by id
const tuteeDetailsById=expressAsyncHandler(async(req,res)=>{
    const tuteeId=req.params.id;
    const tuteeDetails=await tutee.findById(tuteeId);
    if(tuteeDetails){
        res.send({message:"tutee details",payload:tuteeDetails});
    }else{
        res.status(404).send({message:"Tutee not found"});
    }
})

//update tutee details
const updateTutee=expressAsyncHandler(async(req,res)=>{
    const tuteeId=req.params.id;
    const updatedTutee=await tutee.findByIdAndUpdate(tuteeId,req.body,{new:true});
    if(updatedTutee){
        res.send({message:"Tutee updated",payload:updatedTutee});
    }else{
        res.status(404).send({message:"Tutee not found"});
    }
})

//delete tutee details
const deleteTutee=expressAsyncHandler(async(req,res)=>{
    const tuteeId=req.params.id;
    const updatedTutee=await tutee.findByIdAndUpdate(tuteeId,req.body,{new:true});
    if(updatedTutee){
        res.send({message:"Tutee updated",payload:updatedTutee});
    }else{
        res.status(404).send({message:"Tutee not found"});
    }
})
//tutee login route
const loginTutee=expressAsyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    try{
        const tuteeLogin=await validateTutee(email,password);
        if(tuteeLogin){
            const token=await generateToken(tuteeLogin._id);
            console.log("token",token);
            res.status(200).json({token});
        }else{
            res.status(401).json({message:"Invalid credentials"});
        }
        
        }catch(error){
            res.status(500).json({message:error.message})
        }
    }
)

// Forgot Password Route
const forgotPassword = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        const token = await generateResetToken(email, "tutee");
        await sendResetEmail(email, token, "tutee");
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset Password Route
const resetPasswordHandler = expressAsyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        await resetPassword(token, newPassword);
        res.status(200).json({ message: "Password successfully reset" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Search Tutees by Name, Email, Course, City, or State
const searchTutees = expressAsyncHandler(async (req, res) => {
    const { query } = req.query;
    const tutees = await tutee.find({
        $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { course: { $regex: query, $options: "i" } },
            { city: { $regex: query, $options: "i" } },
            { state: { $regex: query, $options: "i" } }
        ]
    });

    res.status(200).json({ message: "Search results", payload: tutees });
});


//filter route (filter based on course,city,state,gender,fee,time slots)
const filterTutees = expressAsyncHandler(async (req, res) => {
    const { course, city, state, gender, minFee, maxFee, timeSlot } = req.query;
    let filterCriteria = {};

    if (course) filterCriteria.course = { $regex: course, $options: "i" }; // Case-insensitive match
    if (city) filterCriteria.city = { $regex: city, $options: "i" };
    if (state) filterCriteria.state = { $regex: state, $options: "i" };
    if (gender) filterCriteria.gender = gender; // Exact match for gender
    if (timeSlot) filterCriteria.timeSlot = timeSlot; // Exact match for timeSlot

    // Fee Structure Filter (if fee is added later)
    if (minFee || maxFee) {
        filterCriteria.fee = {};
        if (minFee) filterCriteria.fee.$gte = parseInt(minFee);
        if (maxFee) filterCriteria.fee.$lte = parseInt(maxFee);
    }

    const filteredTutees = await tutee.find(filterCriteria);
    res.status(200).json({ message: "Filtered tutees", payload: filteredTutees });
});

module.exports={
    createTutee,
    tuteeDetails,
    tuteeDetailsById,
    updateTutee,
    deleteTutee,
    loginTutee,
    forgotPassword,
    resetPasswordHandler
}