const express = require('express')
const router = express.Router()
const Message = require('../model/message')
const Chat = require('../model/chat')
const User = require('../model/user')
const { protect } = require("../middleware/authMiddleware")
const CatchAsync = require('../utils/CatchAsync')


router.post('/message', protect, CatchAsync(async (req, res) => {
  await Message.deleteMany({})
  const { text, chatId } = req.body;

  if (!text || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    text: text,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "firstName pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}))



router.get('/message/:chatId', protect, CatchAsync(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'firstName pic email')
      .populate('chat');
    console.log(messages)
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}));


module.exports = router;