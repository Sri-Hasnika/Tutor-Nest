const expressAsyncHandler=require('express-async-handler');
const DemoClass=require('../Models/demoClassModel');



//tutor side demo class routes
// Schedule a new demo class
const scheduleDemoClass = expressAsyncHandler(async (req, res) => {
    const { tutorId, date, time, duration, subject } = req.body;
    const newDemoClass = new DemoClass({ tutorId, date, time, duration, subject });
    await newDemoClass.save();
    res.status(201).json({ message: "Demo class scheduled successfully", payload: newDemoClass });
});

// Get all demo classes for a tutor
const getDemoClasses = expressAsyncHandler(async (req, res) => {
    const { tutorId } = req.params;
    const demoClasses = await DemoClass.find({ tutorId });
    res.status(200).json({ message: "Tutor's demo classes", payload: demoClasses });
});

// Delete a demo class
const deleteDemoClass = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedClass = await DemoClass.findByIdAndDelete(id);
    if (deletedClass) {
        res.status(200).json({ message: "Demo class deleted successfully" });
    } else {
        res.status(404).json({ message: "Demo class not found" });
    }
});


//tutee side demo class routes
//Tutee books a demo class
const bookDemoClass=expressAsyncHandler(async(req,res)=>{
    const {tuteeId,demoClassId}=req.body;
    const demoClass=await DemoClass.findById(demoClassId);
    if(!demoClass){
        return res.status(404).json({message:"Demo class not found"});
    }
    const bookedDemo=new DemoClass({tuteeId,demoClassId});
    await bookedDemo.save();
    res.status(201).json({message:"Demo class booked successfully",payload:bookedDemo});
})

//Tutee views their booked demo classes
const getBookedDemoClasses=expressAsyncHandler(async(req,res)=>{
    const {tuteeId}=req.params;
    const bookedClasses=await DemoClass.find({tuteeId}).populate('demoClassId');
    res.status(200).json({message:"Tutee's booked demo classes",payload:bookedClasses});
})

//Tutee cancels a booked demo class
const cancelDemoClass=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params;
    const canceledClass=await DemoClass.findByIdAndDelete(id);
    if(canceledClass){
        res.status(200).json({message:"Demo class booking canceled successfully"});
    }else{
        res.status(404).json({message:"Booking not found"});
    }
});


module.exports = { scheduleDemoClass, getDemoClasses, deleteDemoClass,bookDemoClass, getBookedDemoClasses, cancelDemoClass  };