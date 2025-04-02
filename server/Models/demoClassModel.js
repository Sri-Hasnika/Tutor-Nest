const mongoose = require('mongoose');

const demoClassSchema = mongoose.Schema({
    tutorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'tutor',
         required: true 
        },
    date: {
         type: String, 
         required: true
         },
    time: { 
        type: String,
         required: true 
        },
    duration: { 
        type: Number, 
        required: true 
    }, // Duration in minutes
    subject: { 
        type: String,
         required: true
         },
    tuteeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'tutee', 
            // required: true 
        },
    demoClassId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DemoClass', 
        // required: true
    }
}, { timestamps: true });

const DemoClass = mongoose.model('DemoClass', demoClassSchema);
module.exports = DemoClass;
