const Message = require("../models/Message");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMsg = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message
    });
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get chat between two users
exports.getConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
