const express = require('express');
const { createSection, updateSection, deleteSection, updateSectionPosition } = require('../controllers/SectionControllers');
const { isAuthenticated } = require('../middlewares/authentication');
const { param } =require('express-validator');
const validation = require('../middlewares/validation');

const router = express.Router({mergeParams:true});

router.post(
    '/',
    param('boardId').custom(value =>{
        if(!validation.isObjectId(value)){
            return Promise.reject('Invalid id')
        }else return Promise.resolve()
    }),
    validation.validate,
    isAuthenticated,
    createSection
)

router.put(
    '/:sectionId',
    param('boardId').custom(value => {
        if (!validation.isObjectId(value)) {
          return Promise.reject('invalid board id')
        } else return Promise.resolve()
      }),
      param('sectionId').custom(value => {
        if (!validation.isObjectId(value)) {
          return Promise.reject('invalid section id')
        } else return Promise.resolve()
      }),
      validation.validate,
      isAuthenticated,
      updateSection
)
router.delete(
    '/:sectionId',
    param('boardId').custom(value => {
        if (!validation.isObjectId(value)) {
          return Promise.reject('invalid board id')
        } else return Promise.resolve()
      }),
      param('sectionId').custom(value => {
        if (!validation.isObjectId(value)) {
          return Promise.reject('invalid section id')
        } else return Promise.resolve()
      }),
      validation.validate,
      isAuthenticated,
      deleteSection
)




module.exports = router;