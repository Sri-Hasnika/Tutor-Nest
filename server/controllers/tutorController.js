const expressAsyncHandler=require('express-async-handler');
const tutor=require('../Models/tutorModel');
const bcrypt=require('bcrypt');
const {generateToken,validateTutor,generateResetToken,sendResetEmail,resetPassword}=require('../utils/authUtil');


const createTutor=expressAsyncHandler(async(req,res)=>{
    const newTutor=req.body;
    const hashedPassword = await bcrypt.hash(newTutor.password,10);
    newTutor.password=hashedPassword;
    const newTutorObj=tutor(newTutor);
    const TutorObj=await newTutorObj.save();
    res.status(201).send({message:"tutors",payload:TutorObj});
})

const getTutor=expressAsyncHandler(async(req,res)=>{
    const tutors=await tutor.find();
    res.send({message:"all tutors",payload:tutors});
})

const getTutorById=expressAsyncHandler(async(req,res)=>{
    const tutorId=req.params.id;
    const tutorDetails=await tutor.findById(tutorId);
    if(tutorDetails){
        res.send({message:"tutor details",payload:tutorDetails});
    }else{
        res.status(404).send({message:"Tutor not found"});
    }
})


//update tutor details
const updateTutor=expressAsyncHandler(async(req,res)=>{
    const tutorId=req.params.id;
    const updatedTutor=await tutor.findByIdAndUpdate(tutorId,req.body,{new:true});
    if(updatedTutor){
        res.send({message:"Tutee updated",payload:updatedTutor});
    }else{
        res.status(404).send({message:"Tutee not found"});
    }
})


//delete tutor details
const deleteTutor=expressAsyncHandler(async(req,res)=>{
    const tutorId=req.params.id;
    const updatedTutor=await tutor.findByIdAndUpdate(tutorId,req.body,{new:true});
    if(updatedTutor){
        res.send({message:"Tutee updated",payload:updatedTutor});
    }else{
        res.status(404).send({message:"Tutee not found"});
    }
})

//login tutor 
const loginTutor=expressAsyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    try{
        const tutorLogin=await validateTutor(email,password);
        if(tutorLogin){
            const token=await generateToken(tutorLogin._id);
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
const resetPasswordHandler = expressAsyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        await resetPassword(token, newPassword);
        res.status(200).json({ message: "Password successfully reset" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Search Tutors by Name, Email, Course, Subject, City, or State
const searchTutors = expressAsyncHandler(async (req, res) => {
    const { query } = req.query;
    const tutors = await tutor.find({
        $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { courseToTeach: { $regex: query, $options: "i" } },
            { subjectsToTeach: { $regex: query, $options: "i" } },
            { city: { $regex: query, $options: "i" } },
            { state: { $regex: query, $options: "i" } }
        ]
    });

    res.status(200).json({ message: "Search results", payload: tutors });
});


//filter tutors 
const filterTutors = expressAsyncHandler(async (req, res) => {
    const { 
        subject, city, state, gender, qualification, 
        minExperience, maxExperience, minFee, maxFee, 
        minTime, maxTime, tutorLocation 
    } = req.query;
    
    let filterCriteria = {};

    if (subject) filterCriteria.subjectsToTeach = { $regex: subject, $options: "i" };
    if (city) filterCriteria.city = { $regex: city, $options: "i" };
    if (state) filterCriteria.state = { $regex: state, $options: "i" };
    if (gender) filterCriteria.gender = gender; // Exact match for gender
    if (qualification) filterCriteria.qualification = { $regex: qualification, $options: "i" }; // Case-insensitive qualification search
    if (tutorLocation) filterCriteria.tutorLocation = tutorLocation; // Exact match for tutor location

    // Experience Range Filter
    if (minExperience || maxExperience) {
        filterCriteria.experience = {};
        if (minExperience) filterCriteria.experience.$gte = parseInt(minExperience);
        if (maxExperience) filterCriteria.experience.$lte = parseInt(maxExperience);
    }

    // Hourly Price Range Filter
    if (minFee || maxFee) {
        filterCriteria.hourlyPrice = {};
        if (minFee) filterCriteria.hourlyPrice.$gte = parseInt(minFee);
        if (maxFee) filterCriteria.hourlyPrice.$lte = parseInt(maxFee);
    }

    // Preferred Timing Range Filter (Assuming it's stored as a number 0-23 representing hours)
    if (minTime || maxTime) {
        filterCriteria.preferredTime = {};
        if (minTime) filterCriteria.preferredTime.$gte = parseInt(minTime);
        if (maxTime) filterCriteria.preferredTime.$lte = parseInt(maxTime);
    }

    const filteredTutors = await tutor.find(filterCriteria);
    res.status(200).json({ message: "Filtered tutors", payload: filteredTutors });
});

module.exports={
    getTutor,
    createTutor,
    getTutorById,
    updateTutor,
    deleteTutor,
    loginTutor,
    resetPasswordHandler,
    forgotPassword,
    searchTutors,
    filterTutors
}