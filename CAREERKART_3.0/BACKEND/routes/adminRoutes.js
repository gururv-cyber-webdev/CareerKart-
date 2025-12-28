const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.get("/mentors/pending", auth(["admin"]), adminCtrl.listPendingMentors);
router.post("/mentor/approve", auth(["admin"]), adminCtrl.approveMentor);

module.exports = router;
