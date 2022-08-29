const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Worker = require('../models/workerModel');
const router = express.Router()


router.get('/get-all-workers', authMiddleware, async (req, res) => {
    try {
        const workers = await Worker.find();
        
        res.status(200).send({
            success: true,
            data: {
                message: "All workers fetched",
                success: true,
                list: workers

            }
        })
    } catch (error) {
        res.status(500).send({ message: "Error occurs during fetching all workers", success: false, error: error.message });
    }
})

router.get('/get-all-users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        
        res.status(200).send({
            success: true,
            data: {
                message: "All users fetched",
                success: true,
                list: users

            }
        })
    } catch (error) {
        res.status(500).send({ message: "Error occurs during fetching all users", success: false, error: error.message});
    }
})

router.post('/change-apply-status', authMiddleware, async (req, res) => {
    try {

        const {workerId, status} = req.body;
        const worker = await Worker.findByIdAndUpdate(workerId, {
            status,
        });
        const user = await User.findOne({_id: worker.userId})
        const unseenNotification = user.unseenNotification;
        const isWorker = status === "approval" ? true: false;
        if (status === "approval"){
            unseenNotification.push({
                type: "application-approval",
                message: 'your application to become a worker is approved',
            })
        }
        else if (status === "blocked"){
            unseenNotification.push({
                type: "application-blocked",
                message: 'your worker account is blocked',
            })
        }
        
        await User.findByIdAndUpdate(user._id, { unseenNotification, isWorker });

        const workers = await Worker.find();

        
        res.status(200).send({
            success: true,
            data: {
                message: "Status updated successfully",
                success: true,
                list: workers

            }
        })
    } catch (error) {
        res.status(500).send({ message: "Error occurs during updating the status", success: false, error: error.message});
    }
})

module.exports = router;