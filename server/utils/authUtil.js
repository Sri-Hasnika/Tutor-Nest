const jwt=require('jsonwebtoken')
const tutee=require('../Models/tuteeModel');
const tutor=require('../Models/tutorModel');
const bcrypt=require('bcrypt');
require('dotenv').config();

//generate jwt token
const generateToken=async(userId)=>{
    let user=await tutee.findById(userId);
    user.role="tutee";
    if(!user){
        user=await tutor.findById(userId);
        user.role="tutor";
    }
    if (!user){
        throw new Error("User not found");
    }

    return jwt.sign({
        id:userId,
        role:user.role
    },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
};
//validate tutee
const validateTutee=async(email,password)=>{
    if(!email || !password){
        throw new Error('Email and password are required');
    }
    const tuteeValid=await tutee.findOne({email})
    if (!tuteeValid){
        throw new Error('Invalid credentials');
    }
     const isMatch= await bcrypt.compare(password,tuteeValid.password);
     if(!isMatch){
        throw new Error('invalid credentials');
     }
     return tuteeValid;
}

//validate tutor 
const validateTutor=async(email,password)=>{
    if(!email || !password){
        throw new Error("Email and password are required");
    }
    const tutorValid=await tutor.findOne({email})
    if(!tutorValid){
        throw new Error('Invalid credentials');
    }
    const isMatch=await bcrypt.compare(password,tutorValid.password);
    if(!isMatch){
        throw new Error('invalid credentials');
    }
    return tutorValid;
}


module.exports={
    generateToken,
    validateTutee,
    validateTutor
}