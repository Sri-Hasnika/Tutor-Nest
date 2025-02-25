const mongoose=require('mongoose');

const tuteeSchema=mongoose.Schema({
// tuteeId:{
//     type:String,
//     required:true
// },
firstName:{
    type:String,
    required:true
},
lastName:{
    type:String,
    required:true
},
moblieNumber:{
    type:Number,
    required:true,
    minLength:10,
    maxLength:10,
    unique:true,
},
email:{
    type:String,
    required:true,
    unique:true
},
gender:{
    type:String,
    enum:['male','female','others'],
    required:true,
},
studying:{
    type:String,
    required:true,
},
course:{
    type:String,
    required:true,
},
// subject:{
//     type:String,
//     required:true,
// },
// location:{
//     type:String,
//     enum:['online','At Home','At Tutor\'s place','At Institute'],
//     required:true,
// },
// genderTutor:{
//     type:String,
//     enum:['male','female','others'],
// },
// feeType:{
//     type:String,
//     enum:['hourly','weekly','monthly','yearly'],
//     required:true,
// },
// fee:{
//     type:Number,
//     required:true,
// },
// timeSlot:{
//     type:String,
//     required:true,
//     enum:['morning','afternoon','evening','night'],
// },
//location
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

//tutee id
// tuteeId:{
//     type:
// }

//reset and forgot password
resetPasswordToken:{
    type: String, // Stores the hashed reset token
},
resetPasswordExpires: {
    type: Date, // Stores expiration time (e.g., 1 hour)
}

},{"strict":"throw"})

const tutee=mongoose.model('tutee',tuteeSchema);
module.exports=tutee;