const express = require("express");
const router = express.Router();
const mentorCtrl = require("../controllers/mentorController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const multer = require("multer");

router.get("/profile", auth(["mentor"]), mentorCtrl.profile);
router.post("/qa", auth(["mentor"]), upload.single("resume"), mentorCtrl.submitQA);
router.put("/profile", auth(["mentor"]), upload.single("profilePic"), mentorCtrl.editProfile);

module.exports = router;