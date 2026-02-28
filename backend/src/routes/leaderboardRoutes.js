const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');

// GET /api/leaderboard
router.get('/', async (req, res, next) => {
    try {
        const leaderboard = await UserProgress.aggregate([
            {
                $group: {
                    _id: "$userId",
                    completedCount: { $sum: 1 },
                    lastCompleted: { $max: "$completedAt" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    _id: 1,
                    completedCount: 1,
                    name: "$userInfo.name",
                    bio: "$userInfo.bio",
                    createdAt: "$userInfo.createdAt",
                    lastCompleted: 1
                }
            },
            {
                $sort: {
                    completedCount: -1,
                    lastCompleted: 1
                }
            },
            {
                $limit: 100
            }
        ]);

        res.json({ leaderboard });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
