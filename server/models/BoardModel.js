const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOption } =require('./modelOptions');

const boardSchema = new Schema({
    user: {
     type: Schema.ObjectId,
     ref: 'User',
     required: true
   },
     icon:{
         type: String,
         default: '📃'
     },
     title:{
         type: String,
         default: 'Untitled'
     },
     position:{
         type: Number
     },
     favourite:{
         type: Boolean,
         default: false
     },
     favouritePosition:{
         type: Number,
         default: 0
     }
 }, schemaOption);

 const Board = mongoose.model("Board",boardSchema);

 module.exports = Board;