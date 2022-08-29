const express = require('express');
const User = require('../models/userModel');
const Worker = require('../models/workerModel');
const Appt = require('../models/appointmentModel');
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/register', async (req, res) => {
    try {
        const userExisted = await User.findOne({ email: req.body.email });
        if (userExisted) {
            return res.status(200).send({ message: "User already exists", success: false })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        req.body.password = hashedPassword
        const newuser = new User(req.body)
        await newuser.save()
        res.status(200).send({ message: "User created successfully", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error creating user", success: false, error: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: "User does not exists", success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: "Wrong password or username", success: false })
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            res.status(200).send({ message: "Login successfully", success: true, data: token });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error occured during login", success: false, error: error.message })
    }
})

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false });
        } else {
            res.status(200).send({
                success: true,
                data: {
                    name: user.name,
                    email: user.email,
                    isWorker: user.isWorker,
                    isAdmin: user.isAdmin,
                    seenNotification: user.seenNotification,
                    unseenNotification: user.unseenNotification
                }
            })
        }
    } catch (error) {
        res.status(500).send({ message: "Error occurs during getting user info", success: false, error: error.message });
    }
})

router.post('/apply-for-worker', authMiddleware, async (req, res) => {
    try {
        console.log(req.body)
        const exist = await Worker.findOne({userId: req.body.userId})
        if (exist){
            res.status(200).send({
                success: false,
                message: "you have already applied!"
            })
        }else{

            const newWorker = new Worker({ ...req.body })

            await newWorker.save();
            const adminUser = await User.findOne({ isAdmin: true });
            const unseenNotification = adminUser.unseenNotification;
            unseenNotification.push({
                type: "new-worker-application",
                message: `${newWorker.firstName} ${newWorker.lastName} has applied to become a worker`,
                data: {
                    workerId: newWorker.userId,
                    name: newWorker.firstName + " " + newWorker.lastName
                },
                onClickPath: "/admin/workers"
            })


            await User.findByIdAndUpdate(adminUser._id, { unseenNotification });

            res.status(200).send({
                success: true,
                message: "worker account applied successfully"
            })
        }``

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error occured during sign up", success: false, ererror: error.messageror })
    }
})

router.post('/mark-all-as-read', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        const unseenNotification = user.unseenNotification;
        user.seenNotification.push(...unseenNotification);
        user.unseenNotification = [];
        await User.findByIdAndUpdate(user._id, user);

        res.status(200).send({
            success: true,
            message: "Marked All as Read"
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error occured during clear unread message", success: false, error: error.message })
    }
})

router.post('/delete-all', authMiddleware, async (req, res) => {
    try {
        console.log("in backend");
        const user = await User.findOne({ _id: req.body.userId });
        user.seenNotification = [];
        await User.findByIdAndUpdate(user._id, user);

        res.status(200).send({
            success: true,
            message: "Deleted All Notifications"
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error occured during deleting notifications", success: false, ererror: error.messageror })
    }
})

router.post('/updateProfile', authMiddleware, async (req, res) => {
    try {
        console.log("in backend");
        const user = await User.findOne({ _id: req.body.userId });
        user.username = req.body.username;
        user.email = req.body.email;
        await User.findByIdAndUpdate(user._id, user);

        if (user.isWorker){
            const worker = await Worker.findOne({userId: user._id});
            worker.firstName = req.body.firstName;
            worker.lastName = req.body.lastName;
            worker.business = req.body.business;
            worker.phoneNumber = req.body.phoneNumber;
            worker.website = req.body.website;
            worker.address = req.body.address;
            worker.rate = req.body.rate;
            worker.description = req.body.description;
            worker.time = req.body.time;
            await Worker.findByIdAndUpdate(worker._id, worker);
        }

        res.status(200).send({
            success: true,
            message: "Updated user profile"
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error occured during undating profiles", success: false, ererror: error.messageror })
    }
})

router.get('/get-all-appts', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        let appts = []
        if (user.isWorker){
            const worker = await Worker.findOne({userId: user._id});
            appts = await Appt.find({workerId: worker._id})
        }else{
            appts = await Appt.find({userId: user._id})
            
        }
        //console.log(appts)
        res.status(200).send({
            success: true,
            data: {
                message: "All appointments fetched",
                success: true,
                list: appts

            }
        })
    } catch (error) {
        res.status(500).send({ message: "Error occurs during fetching booked service", success: false, error: error.message});
    }
})



module.exports = router;