const mongoose=require('mongoose');

const tutorSchema=mongoose.Schema({
// TutorId:{
//     type:String,
//     required:true,
// },
firstName:{
    type:String,
    required:true,
},
lastName:{
    type:String,
    required:true,
},
mobileNo:{
    type:Number,
    minLength:10,
    maxLength:10,
    required:true,
},
email:{
    type:String,
    required:true,
},
age:{
    type:Number,
    min:18,
    required:true,
},
gender:{
    type:String,
    enum:['male','female','others'],
    required:true,
},
courseToTeach:[{
    type:String,
    required:true,
}],
// subjectsToTeach:{
//     type:String,
//     required:true,
// },

subjectsToTeach:[{
    type:String,
    required:true,
}],

//qualifications page
qualification:{
    type:String,
    required:true,
},
experience:{
    type:Number,
    required:true,
},
preferredTime:{
    type:String,
    enum:['morning','afternoon','evening','night'],
    required:true,
},
hourlyPrice:{
    type:Number,
    required:true,
},
tutorLocation:{
    type:String,
    enum:['At Student\'s Place','At Home','Institute','Online'],
},
AboutMe:{
    type:String,
    required:true,
},

//resume
resume:{
    type:String,
    required:true,
},

//tutor location
pincode:{
    type:Number,
    minLength:6,
    maxLength:6,
    required:true,
},
locality:{
    type:String,
    required:true,
},
city:{
    type:String,
    required:true,
},
state:{
    type:String,
    required:true,
},
//conform password
password:{
    type:String,
    required:true,
    minLength:6,
},
// conformPassword:{
//     type:password,
//     required:true,
//     minLength:6,
// },

//profile image
profileImage:{
    type:String,
}
},{"strict":"throw"});

const tutor=mongoose.model('tutor',tutorSchema);
module.exports=tutor;