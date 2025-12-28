const mongoose = require("mongoose");
const Mentor = require("../models/Mentor");
const { generateDocAndUpload } = require("../services/awsService");

// Save mentor Q&A and upload to AWS
exports.submitQA = async (req, res) => {
  try {
    const qaArr = JSON.parse(req.body.qa); // Parse string to array
    const mentor = await Mentor.findOne({ user: req.user.id });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    mentor.qa = qaArr; // Save as array
    if (req.file) mentor.resume = req.file.path;
    await mentor.save();
    await generateDocAndUpload(mentor); // (see AWS below)
    res.json({ message: "Q&A saved and uploaded" });
  } catch (err) {
    console.error("Mentor QA error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get mentor profile
exports.profile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id }).populate("user", "email status");
    if (!mentor) return res.status(404).json({ message: "Not found" });
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit mentor profile
exports.editProfile = async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) updates.profilePic = req.file.path;

    // Sanitize the `user` field to avoid ObjectId casting errors
    if (updates.user) {
      try {
        if (typeof updates.user === "object" && updates.user._id) {
          updates.user = updates.user._id;
        }
        updates.user = new mongoose.Types.ObjectId(updates.user);
      } catch (e) {
        delete updates.user; // Remove if invalid
      }
    }

    const mentor = await Mentor.findOneAndUpdate(
      { user: req.user.id },
      updates,
      { new: true }
    );

    if (!mentor) return res.status(404).json({ message: "Not found" });
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};