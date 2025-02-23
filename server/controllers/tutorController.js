const expressAsyncHandler=require('express-async-handler');
const tutor=require('../Models/tutorModel');
const bcrypt=require('bcrypt');
const {generateToken,validateTutor}=require('../utils/authUtil');


const createTutor=expressAsyncHandler(async(req,res)=>{
    const newTutor=req.body;
    const newTutorObj=tutor(newTutor);
    const TutorObj=await newTutorObj.save();
    res.status(201).send({message:"tutors",payload:TutorObj});
})

const getTutor=expressAsyncHandler(async(req,res)=>{
    const tutors=await tutee.find();
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


//delete tutee details
const deleteTutor=expressAsyncHandler(async(req,res)=>{
    const tutorId=req.params.id;
    const updatedTutor=await tutee.findByIdAndUpdate(tutorId,req.body,{new:true});
    if(updatedTutor){
        res.send({message:"Tutee updated",payload:updatedTutor});
    }else{
        res.status(404).send({message:"Tutee not found"});
    }
})


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
module.exports={
    getTutor,
    createTutor,
    getTutorById,
    updateTutor,
    deleteTutor,
    loginTutor
}