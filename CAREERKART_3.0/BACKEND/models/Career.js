// models/Career.js
const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: String,
  suggestion: String,
});

module.exports = mongoose.model('Career', careerSchema);
