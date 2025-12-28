const express = require("express");
const router = express.Router();
const studentCtrl = require("../controllers/studentController");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/profile", auth(["student"]), studentCtrl.profile);
router.put("/profile", auth(["student"]), upload.single("profilePic"), studentCtrl.editProfile);
router.post("/careerSearch", auth(["student"]), studentCtrl.careerSearch);
// router.get("/roadmap/:studentId", studentCtrl.getStudentRoadmap);

module.exports = router;

