// const expressAsyncHandler=require('express-async-handler');
const DemoRequest = require('../Models/demoClassModel');



// //tutor side demo class routes
// // Schedule a new demo class
// const scheduleDemoRequest = expressAsyncHandler(async (req, res) => {
//     const { tutorId, date, time, duration, subject } = req.body;
//     const newDemoRequest = new DemoRequest({ tutorId, date, time, duration, subject });
//     await newDemoRequest.save();
//     res.status(201).json({ message: "Demo class scheduled successfully", payload: newDemoRequest });
// });

// // Get all demo classes for a tutor
// const getDemoRequestes = expressAsyncHandler(async (req, res) => {
//     const { tutorId } = req.params;
//     const DemoRequestes = await DemoRequest.find({ tutorId });
//     res.status(200).json({ message: "Tutor's demo classes", payload: DemoRequestes });
// });

// // Delete a demo class
// const deleteDemoRequest = expressAsyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const deletedClass = await DemoRequest.findByIdAndDelete(id);
//     if (deletedClass) {
//         res.status(200).json({ message: "Demo class deleted successfully" });
//     } else {
//         res.status(404).json({ message: "Demo class not found" });
//     }
// });


// //tutee side demo class routes
// //Tutee books a demo class
// const bookDemoRequest=expressAsyncHandler(async(req,res)=>{
//     const {tuteeId,DemoRequestId}=req.body;
//     const DemoRequest=await DemoRequest.findById(DemoRequestId);
//     if(!DemoRequest){
//         return res.status(404).json({message:"Demo class not found"});
//     }
//     const bookedDemo=new DemoRequest({tuteeId,DemoRequestId});
//     await bookedDemo.save();
//     res.status(201).json({message:"Demo class booked successfully",payload:bookedDemo});
// })

// //Tutee views their booked demo classes
// const getBookedDemoRequestes=expressAsyncHandler(async(req,res)=>{
//     const {tuteeId}=req.params;
//     const bookedClasses=await DemoRequest.find({tuteeId}).populate('DemoRequestId');
//     res.status(200).json({message:"Tutee's booked demo classes",payload:bookedClasses});
// })

// //Tutee cancels a booked demo class
// const cancelDemoRequest=expressAsyncHandler(async(req,res)=>{
//     const {id}=req.params;
//     const canceledClass=await DemoRequest.findByIdAndDelete(id);
//     if(canceledClass){
//         res.status(200).json({message:"Demo class booking canceled successfully"});
//     }else{
//         res.status(404).json({message:"Booking not found"});
//     }
// });



// // Tutee sends a demo request to tutor
// const sendDemoRequest = expressAsyncHandler(async (req, res) => {
//     const { tuteeId, tutorId, subject, message } = req.body;
//     const newRequest = new DemoRequest({ tuteeId, tutorId, subject, message });
//     await newRequest.save();
//     res.status(201).json({ message: "Demo request sent successfully", payload: newRequest });
// });

// // Tutor views demo requests
// const getDemoRequestsForTutor = expressAsyncHandler(async (req, res) => {
//     const { tutorId } = req.params;
//     const requests = await DemoRequest.find({ tutorId }).populate('tuteeId');
//     res.status(200).json({ message: "Demo requests for tutor", payload: requests });
// });

// // Tutor responds with meet link
// const respondToDemoRequest = expressAsyncHandler(async (req, res) => {
//     const { requestId } = req.params;
//     const { status, meetLink } = req.body;

//     const request = await DemoRequest.findById(requestId);
//     if (!request) {
//         return res.status(404).json({ message: "Request not found" });
//     }

//     request.status = status || request.status;
//     request.meetLink = meetLink || request.meetLink;

//     await request.save();
//     res.status(200).json({ message: "Response sent to demo request", payload: request });
// });



// module.exports = {
//     scheduleDemoClass,
//     getDemoClasses,
//     deleteDemoClass,
//     bookDemoClass,
//     getBookedDemoClasses,
//     cancelDemoClass,
//     sendDemoRequest,
//     getDemoRequestsForTutor,
//     respondToDemoRequest
// };

const bookDemoClass = async(req,res)=>{
    try{
        const {tuteeId,tutorId,subject,message}=req.body;
        console.log(tuteeId, tutorId, subject, message);
        const demoClassResponse=await DemoRequest.create({
            tuteeId,
            tutorId,
            subject,
            message
        })
        if(demoClassResponse){
            res.status(200).json({message:"Demo class booked successfully",payload:demoClassResponse})
        }
        else{
            res.status(400).json({message:"Unable to book demo class"})
        }
    }catch(err){
        console.log("Error while booking the demo class",err)
        res.status(500).json({message:"Internal server error"})
    }
}

const getBookedDemoClasses = async(req,res)=>{
    try {
        const {tuteeId}=req.params;
        console.log(tuteeId);
        const bookedClasses=await DemoRequest.find({tuteeId}).populate('tutorId');
        if(bookedClasses.length>0){
            res.status(200).json({message:"Booked demo classes",payload:bookedClasses})
        }
        else{
            res.status(404).json({message:"No booked demo classes found"})
        }
    }
    catch (err) {
        console.log("Error while fetching booked demo classes",err)
        res.status(500).json({message:"Internal server error"})
    }
}

const getBookedDemoRequests = async(req,res)=>{
    try {
        const {tutorId}=req.params;
        const bookedClasses=await DemoRequest.find({tutorId}).populate('tuteeId');
        if(bookedClasses.length>0){
            res.status(200).json({message:"Booked demo classes",payload:bookedClasses})
        }
        else{
            res.status(404).json({message:"No booked demo classes found"})
        }
    }
    catch (err) {
        console.log("Error while fetching booked demo classes",err)
        res.status(500).json({message:"Internal server error"})
    }
}

const addMeetLink = async(req,res)=>{
    try{
        const {tutorId,classId}=req.params;
        const {meetLink, finalDate}=req.body;
        const updatedClass = await DemoRequest.findByIdAndUpdate(classId, { meetLink, finalDate }, { new: true });
        if (updatedClass) {
            res.status(200).json({ message: "Meet link added successfully", payload: updatedClass });
        }
        else {
            res.status(404).json({ message: "Demo class not found" });
        }
    }catch(err){
        console.log("Error while adding meet link",err)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports={
    bookDemoClass,
    getBookedDemoClasses,
    getBookedDemoRequests,
    addMeetLink,
}
