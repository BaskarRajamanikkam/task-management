const express = require('express');
const validation = require('../middlewares/validation');
const { isAuthenticated } = require('../middlewares/authentication');
const { taskCreate } = require('../controllers/TaskControllers');
const { param, body } = require('express-validator');
const router = express.Router({ mergeParams: true });

router.post(
    '/',
    param('boardId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('Invalid id')
        } else return Promise.resolve()
    }),
    body('sectionId').custom(value => {
        if (!validation.isObjectId(value)) {
            return Promise.reject('invalid section id')
        } else return Promise.resolve()
    }),
    validation.validate,
    isAuthenticated,
    taskCreate
)



module.exports = router;