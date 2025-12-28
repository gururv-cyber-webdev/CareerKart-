const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: "uploads/" }); // configure storage as needed
const validatePassword = require("../middleware/validatePassword");

const authController = require("../controllers/authController");

router.post("/student/register", upload.single("profilePic"), validatePassword, authController.registerStudent);
router.post("/mentor/register", upload.fields([{ name: "profilePic" }, { name: "idProof" }]),validatePassword, authController.registerMentor);
router.post("/login", authController.login);

module.exports = router;
