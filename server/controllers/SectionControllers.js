const catchAsyncErrorHandler = require("../middlewares/catchAsyncErrorHandler");
const Section = require("../models/SectionModel");
const Task = require("../models/TaskModel");


exports.createSection = catchAsyncErrorHandler(async(req,res,next)=>{
   const {boardId} = req.params;
    try {
        const section = await Section.create({board: boardId});
        section._doc.tasks = []
        res.status(201).json(section);
    } catch (error) {
        console.log(error)
    }
});

exports.updateSection = catchAsyncErrorHandler(async(req,res,next)=>{
    const sectionId  = req.params.sectionId;
    const {title} = req.body;
    try {
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { title }, {new: true}
        )
        section._doc.tasks = []
        res.status(200).json(section)
    } catch (error) {
        console.log(error);
    }
})


exports.deleteSection = catchAsyncErrorHandler(async(req,res,next)=>{
    const sectionId = req.params.sectionId;
    try {
        await Task.deleteMany({ section: sectionId })
        await Section.deleteOne({ _id: sectionId});
        res.status(200).json('deleted')
    } catch (error) {
        console.log(error)
    }
})

