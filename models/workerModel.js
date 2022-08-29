const mongoose = require('mongoose');
const workerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    website: {
        type: String,
    },
    address: {
        type: String,
    },
    business: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    rate: {
        type: Number,
        required: true
    },
    time:{
        type: Array,
        required: true
    },
    status:{
        type: String,
        default: "pending"
    }
},
{
    timestamps: true
});

const workerModel = mongoose.model('worker', workerSchema);

module.exports = workerModel;