const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  dob: Date,
  location: String,
  education: { type: String, enum: ["10th", "12th", "UG", "PG", "Diploma", "PhD", "Other"] },
  jobRole: String,
  idProof: String,
  profilePic: String,
  qa: [
    {
      q: String,
      a: String
    }
  ],
  resume: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mentor", mentorSchema);