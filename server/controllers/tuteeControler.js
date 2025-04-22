const expressAsyncHandler=require('express-async-handler');
const tutee=require('../Models/tuteeModel');
const bcrypt=require('bcrypt');
const {generateToken,validateTutee,generateResetToken,sendResetEmail,resetPassword}=require('../utils/authUtil');


//create a new tutee
const createTutee=expressAsyncHandler(async(req,res)=>{
    // console.log("entering");
    const newTutee=req.body;
    const hashedPassword=await bcrypt.hash(newTutee.password,10);
    
    newTutee.password=hashedPassword;
    // console.log(newTutee);
    const newTuteeObj=tutee(newTutee);
    
    const TuteeObj=await newTuteeObj.save();
    
    res.status(201).send({message:"tutees",payload:TuteeObj});
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
    console.log(tuteeId);
    const updatedTutee=await tutee.findByIdAndUpdate(tuteeId,req.body,{new:true});
    console.log(updatedTutee)
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
            // console.log("token",token);
            res.status(200).json({token,tuteeLogin});
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
    let user = await tutee.findOne({ email }) || await tutor.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const token = await generateResetToken(email, user instanceof tutee ? "tutee" : "tutor");
        await sendResetEmail(email, token, user instanceof tutee ? "tutee" : "tutor");
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: error.message });
    }
});


// Reset Password Route
const resetPasswordHandler = async (token, newPassword) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let user = await tutee.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    }) || await tutor.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) throw new Error("Invalid or expired token");

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save({ validateBeforeSave: false });

    return { message: "Password successfully reset" };
};


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
    resetPasswordHandler,
    searchTutees,
    filterTutees
}