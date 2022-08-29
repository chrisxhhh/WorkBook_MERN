const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Worker = require('../models/workerModel');
const Appt = require('../models/appointmentModel');
const moment = require('moment');
const router = express.Router()

router.get('/get-profile-info-by-userId', authMiddleware , async (req, res) => {
    try {
        const worker = await Worker.findOne({ userId: req.body.userId });
        const user = await User.findOne({ _id: req.body.userId });
        res.status(200).send({
            success: true,
            workerInfo: worker? {
                business: worker.business,
                createdAt: worker.createdAt,
                email: worker.email,
                phoneNumber: worker.phoneNumber,
                rate: worker.rate,
                status: worker.status,
                time: worker.time,
                firstName: worker.firstName,
                lastName: worker.lastName,
                website: worker?.website,
                address: worker?.address,
                description: worker?.description,
            } : null,
            userInfo: {
                createdAt: user.createdAt,
                email: user.email,
                isWorker: user.isWorker,
                name: user.name,
            }
        })
    } catch (error) {
        res.status(500).send({ message: "Error occurs during getting worker profile", success: false, error: error.message });
    }
})

router.post('/check-date-get-timeslot', authMiddleware , async (req, res) => {
    try {
        const today = new moment(req.body.date)
        const todayDate = today.format("MM/DD/YYYY");
        
        const existAppt = await Appt.find({date:todayDate, workerId:req.body.workerId});
        console.log(existAppt);
        const worker = await Worker.findOne({ _id: req.body.workerId });

        const startTime = new moment(worker.time[0]).startOf('minute');
        startTime.set({'year': today.year(), 'month': today.month(), 'date': today.date()})
        const endTime = new moment(worker.time[1]).startOf('minute');
        endTime.set({'year': today.year(), 'month': today.month(), 'date': today.date()})
        
        let hour = today.startOf('day');
        const timeSlot = [];
        while (hour.isBefore(endTime) ){
            if (hour.isSameOrAfter(startTime) && !existAppt.find(appt=>appt.startTime==hour.format("HH:mm"))){
                timeSlot.push(hour.format("HH:mm"));
            }
            hour.add(30, "m");   
        }
        res.status(200).send({
            success: true,
            timeSlot: timeSlot
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: "Error occurs during checking date availability", success: false, error: error.message });
    }
})

router.post('/book-appointment', authMiddleware , async (req, res) => {
    try {
        const worker = await Worker.findOne({ _id: req.body.workerId });
        req.body.workerEmail = worker.email;
        req.body.workerName = `${worker.firstName} ${worker.lastName}`;

        const workerUser = await User.findOne({ _id: worker.userId });
        const user = await User.findOne({ _id: req.body.userId });
        req.body.userEmail = user.email;
        req.body.userName = user.name;
        const unseenNotification = workerUser.unseenNotification;
        unseenNotification.push({
            type: "appointment-booking",
            message: `${user.name} booked an appointment`,
        })

        const newAppt = new Appt(req.body);
        await newAppt.save();
        await User.findByIdAndUpdate(workerUser._id, { unseenNotification });

        res.status(200).send({ message: "Appointment booked successfully", success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: "Error occurs during booking", success: false, error: error.message });
    }
})


module.exports = router;