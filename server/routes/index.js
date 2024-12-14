const express = require('express');

const router = express.Router();


router.use('/auth',require('./AuthRoutes'));

router.use('/boards',require('./BoardRoutes'));

router.use('/boards/:boardId/sections',require('./SectionRoutes'));

router.use('/boards/:boardId/tasks',require('./TaskRoutes'));

module.exports = router;