const jwt=require('jsonwebtoken')
const crypto=require('crypto');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const tutee=require('../Models/tuteeModel');
const tutor=require('../Models/tutorModel');
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
    // console.log(tuteeValid)
    if (!tuteeValid){
        throw new Error('Invalid credentials');
    }
     const isMatch= await bcrypt.compare(password,tuteeValid.password);
     console.log("has")
     console.log(isMatch)
     if(!isMatch){
        throw new Error('invalid credentials');
     }
    //  console.log("isMatch")
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
//generate reset token 
const generateResetToken=async(email,role)=>{
    let user;
    if(role=='tutee'){
        user=await tutee.findOne({email});
    }else{
        user=await tutor.findOne({email});
    }
    if(!user){
        throw new Error('user not found');
    }
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1-hour expiry

    await user.save();
    return resetToken;
}

// Send Password Reset Email
const sendResetEmail = async (email, token, role) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const resetURL = `http://yourfrontend.com/reset-password/${token}`;

    const mailOptions = {
        to: email,
        from: 'no-reply@tutorseek.com',
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link below to reset your password:
        ${resetURL} 

        This link will expire in 1 hour. If you didn’t request this, ignore this email.`
    };

    await transporter.sendMail(mailOptions);
};


// Reset Password
const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    let user = await tutee.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        user = await tutor.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
    }

    if (!user) {
        throw new Error("Invalid or expired token");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
};

module.exports={
    generateToken,
    validateTutee,
    validateTutor,
    generateResetToken,
    sendResetEmail,
    resetPassword
}
