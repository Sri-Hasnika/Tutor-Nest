const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
    tuteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutee',
        required: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutor',
        required: true
    },
    subject: {
        type: String,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    meetLink: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);

module.exports = DemoRequest;
