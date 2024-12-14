const express = require("express");
const { param } = require("express-validator");
const validation = require("../middlewares/validation");
const { isAuthenticated } = require("../middlewares/authentication");
const {
  createBoard,
  getOneBoard,
  getAllBoard,
  updatePosition,
  deleteBoard,
  updateBoard,
} = require("../controllers/BoardControllers");

const router = express.Router();

// create new board for user
router.route("/create-board").post(isAuthenticated, createBoard);

// getAll boards
router.route("/all-boards").get(isAuthenticated, getAllBoard);

// get one board for boardId and authorized user
router.route('/:boardId').get(
  param("boardId").custom((value)=>{
    if(!validation.isObjectId(value)){
      return Promise.reject("Invalid Id")
    }else return Promise.resolve()
  }), 
  validation.validate, 
  isAuthenticated, 
  getOneBoard
);

// update board
router.route("/:boardId").put(
  param("boardId").custom((value)=>{
    if(!validation.isObjectId(value)){
      return Promise.reject("Invalid Id")
    }else return Promise.resolve()
  }), 
  validation.validate,
  isAuthenticated,
  updateBoard
);

// update board positions
router.route("/").put(isAuthenticated,updatePosition);

// delete board for boardId
router.route("/:boardId").delete(
  param("boardId").custom((value)=>{
    if(!validation.isObjectId(value)){
      return Promise.reject("Invalid ID");
    }else return Promise.resolve();
  }),
  validation.validate,
  isAuthenticated, 
  deleteBoard
);

module.exports = router;
