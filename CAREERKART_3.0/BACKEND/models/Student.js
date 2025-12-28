const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  dob: Date,
  location: String,
  education: { type: String, enum: ["10th", "12th", "UG", "PG", "Diploma", "PhD", "Other"] },
  institution: String,
  profilePic: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", studentSchema);