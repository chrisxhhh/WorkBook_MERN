const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    workerId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    workerName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    workerEmail: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
    

},{
    timestamps: true
} )

const appointmentModel = mongoose.model('appointments', appointmentSchema);

module.exports = appointmentModel;