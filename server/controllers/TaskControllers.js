const catchAsyncErrorHandler = require("../middlewares/catchAsyncErrorHandler");
const Section = require("../models/SectionModel");
const Task = require("../models/TaskModel");



exports.taskCreate = catchAsyncErrorHandler(async(req,res,next)=>{
    const sectionId = req.body.sectionId;
    const title = req.body.title;

    try {
        const section = await Section.findById(sectionId);
        const taskCount = await Task.find({section: sectionId}).countDocuments();
        const task = await Task.create({
            section: sectionId,
            title: title,
            position: taskCount > 0 ? taskCount : 0
        })
        task._doc.section = section;
        res.status(201).json(task);
    } catch (error) {
        console.log(error);
    }
})