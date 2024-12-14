const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOption } =require('./modelOptions');

const sectionSchema = new Schema({
    board: {
        type: Schema.ObjectId,
        ref: 'Board',
        required: true
      },
      title: {
        type: String,
        default: 'Untitled'
      },
},schemaOption);

const Section = mongoose.model("Section",sectionSchema);

module.exports = Section;