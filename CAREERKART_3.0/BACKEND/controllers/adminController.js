const User = require("../models/User");

exports.approveMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    const user = await User.findById(mentorId);
    if (!user || user.role !== "mentor") return res.status(404).json({ message: "Mentor not found" });
    user.status = "approved";
    await user.save();
    res.json({ message: "Mentor approved" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.listPendingMentors = async (req, res) => {
  try {
    const pending = await User.find({ role: "mentor", status: "pending" });
    res.json(pending);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

