const catchAsyncErrorHandler = require("../middlewares/catchAsyncErrorHandler");
const Board = require("../models/BoardModel");
const Section = require("../models/SectionModel");
const Task = require("../models/TaskModel");
const ErrorHandler = require("../utils/errorHandler");

//create board for user
exports.createBoard = catchAsyncErrorHandler(async (req, res, next) => {
  try {
    const boardCount = await Board.countDocuments();
    const board = await Board.create({
      user: req.user.id,
      position: boardCount > 0 ? boardCount : 0,
    });
    res.status(201).json(board);
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

//get all boards for user
exports.getAllBoard = catchAsyncErrorHandler(async (req, res, next) => {
  try {
    const boards = await Board.find({ user: req.user.id }).sort('-position');
    res.status(200).json(boards);
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get one board for boardId and user id
exports.getOneBoard = catchAsyncErrorHandler(async (req, res, next) => {
  const boardId = req.params.boardId;
  try {
    const board = await Board.findOne({ user: req.user.id, _id: boardId });
    if (!board) return next(new ErrorHandler("Board Not Found", 404));
    res.status(200).json(board);
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// update board title and favourites
exports.updateBoard = catchAsyncErrorHandler(async (req, res, next) => {
  const boardId = req.params.boardId;
  const { title, favourite } = req.body;
  try {
    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return next(new ErrorHandler("Board not found", 404));
    if(favourite !== undefined && currentBoard.favourite !== favourite){
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id:  boardId 
      }).sort('favouritePosition')
      if(favourite){
        req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0;
      }else{
        for(const key in favourites){
          const element = favourites[key];
          await Board.findByIdAndUpdate(element.id, {$set:{favouritePosition:key}})
        }
      }
    }
    const board = await Board.findByIdAndUpdate(
      boardId,
      { $set: req.body} ,
      { new: true }
    );
    res.status(200).json(board);
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// update board positions
exports.updatePosition = catchAsyncErrorHandler(async (req, res, next) => {
  const { boards } =req.body;
  try {
    for(const key in boards.reverse()){
      const board = boards[key]
      await Board.findByIdAndUpdate(board._id, {$set: {position: key}})
    }
    res.status(200).json("ok")
  } catch (err) {
    return next(new ErrorHandler(error, 400));
  }
});

// delete board
exports.deleteBoard = catchAsyncErrorHandler(async (req, res, next) => {
  const { boardId } = req.params;
  try {
    await Board.deleteOne({ _id: boardId });
    res.status(200).json("deleted");
  } catch (error) {
    console.log(error);
  }
  console.log(boardId);
});

// exports.getOneBoard = catchAsyncErrorHandler(async(req,res,next)=>{
//   const {boardId} = req.params;
//   try {
//     const board = await Board.findOne({user: req.user.id, _id: boardId});
//     if(!board) return res.status(404).json('Board Not Found');
//     const sections = await Section.find({board: boardId});
//     for (const section of sections) {
//       const tasks = await Task.find({ section: section.id }).populate('section').sort('-position')
//       section._doc.tasks = tasks
//     }
//     board._doc.sections = sections;
//     res.status(200).json(board)
//   } catch (error) {
//     console.log(error);
//   }
// })
