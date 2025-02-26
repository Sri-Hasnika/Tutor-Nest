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