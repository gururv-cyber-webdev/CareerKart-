const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const msgCtrl = require("../controllers/messageController");

router.post("/send", auth(["student", "mentor"]), msgCtrl.sendMessage);
router.get("/chat/:otherUserId", auth(["student", "mentor"]), msgCtrl.getConversation);

module.exports = router;



app.use("/api/messages", require("./routes/messageRoutes"));