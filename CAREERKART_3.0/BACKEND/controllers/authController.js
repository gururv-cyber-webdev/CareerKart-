const User = require("../models/User");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerStudent = async (req, res) => {
  try {
    const { email, password, name, dob, location, education, institution } = req.body;

    // File handling (profile picture)
    const profilePic = req.files?.profilePic?.[0]?.path || null;

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user with student role and name
    const user = await User.create({
      email,
      password: hashed,
      role: "student",
      name  // ✅ Save name in User (as in mentor)
    });

    // Create student profile
    await Student.create({
      user: user._id,
      name,
      dob,
      location,
      education,
      institution,
      profilePic
    });

    res.status(201).json({ message: "Student registered" });

  } catch (e) {
    console.error("Student registration error:", e);
    res.status(400).json({ message: e.message });
  }
};


exports.registerMentor = async (req, res) => {
  try {
    const { email, password, name, dob, location, education, jobRole } = req.body;

    // File handling
    const profilePic = req.files?.profilePic?.[0]?.path || null;
    const idProof = req.files?.idProof?.[0]?.path || null;

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save name and idProof in User (schema allows it)
    const user = await User.create({
      email,
      password: hashed,
      role: "mentor",
      name,
      idProof ,
      status: "pending",         // ✅ Save name in User
            // ✅ Save idProof in User
    });

    // Save extra mentor details
    await Mentor.create({
      user: user._id,
      name,
      dob,
      location,
      education,
      jobRole,
      profilePic,
      idProof
    });

    res.status(201).json({ message: "Mentor registered, wait for approval" });

  } catch (e) {
    console.error("Mentor registration error:", e);
    res.status(400).json({ message: e.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "mentor" && user.status !== "approved")
      return res.status(403).json({ message: "Mentor not approved" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
