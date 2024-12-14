const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOption } =require('./modelOptions');


const taskSchema = new Schema({
    section: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    position: {
      type: Number
    }
  }, schemaOption)

  const Task = mongoose.model("Task",taskSchema);

  module.exports = Task;