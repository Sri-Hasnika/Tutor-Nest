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
mobileNumber:{
    type:Number,
    required:true,
},
email:{
    type:String,
    required:true,
    unique:true,
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
tutorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'tutor',
},

//reset and forgot password
resetPasswordToken:{
    type: String,
},
resetPasswordExpires: {
    type: Date,
},

},{timestamps: true})

const tutee=mongoose.model('tutee',tuteeSchema);
module.exports=tutee;