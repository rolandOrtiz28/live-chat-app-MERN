const express = require('express')
const router = express.Router()
const Chat = require('../model/chat')
const User = require('../model/user')
const CatchAsync = require('../utils/CatchAsync')
const { chats } = require('../Data/data')
const { protect } = require("../middleware/authMiddleware")


router.post('/chat', protect, CatchAsync(async (req, res) => {
        const { userId } = req.body;
        if (!userId) {
                console.log("UserId failed to send");
                return res.sendStatus(400);
        }
        var isChat = await Chat.find({
                isGroupChat: false,
                users: { $all: [req.user._id, userId] },
        }).populate("users", "-password")
                .populate("latestMessage")


        isChat = await User.populate(isChat, {
                path: 'latestMessage.sender',
                select: "firstName pic email",
        })

        if (isChat.length > 0) {
                res.send(isChat[0]);
        } else {
                var chatData = {
                        chatName: "sender",
                        isGroupChat: false,
                        users: [req.user._id, userId],
                }
                try {
                        const createdChat = await Chat.create(chatData);

                        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")

                        res.status(200).send(FullChat)
                } catch (error) {
                        res.status(400);
                        throw new Error(error.message)
                }

        }
}))

router.post('/chat/group', protect, CatchAsync(async (req, res) => {
        if (!req.body.users || !req.body.name) {
                return res.status(400).send({ message: "Please Fill all the feilds" });
        }

        var users = JSON.parse(req.body.users);

        if (users.length < 2) {
                return res
                        .status(400)
                        .send("More than 2 users are required to form a group chat");
        }

        users.push(req.user);

        try {
                const groupChat = await Chat.create({
                        chatName: req.body.name,
                        users: users,
                        isGroupChat: true,
                        groupAdmin: req.user,
                });

                const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password");

                res.status(200).json(fullGroupChat);
        } catch (error) {
                res.status(400);
                throw new Error(error.message);
        }


}))
router.put('/chat/rename', protect, CatchAsync(async (req, res) => {
        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                {
                        chatName: chatName,
                },
                {
                        new: true,
                }
        )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
        console.log(updatedChat)
        if (!updatedChat) {
                res.status(404);
                throw new Error("Chat Not Found");
        } else {
                res.json(updatedChat);
        }

}))
router.put('/chat/groupRemove', protect, CatchAsync(async (req, res) => {
        const { chatId, userId } = req.body;

        // check if the requester is admin

        const removed = await Chat.findByIdAndUpdate(
                chatId,
                {
                        $pull: { users: userId },
                },
                {
                        new: true,
                }
        )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

        if (!removed) {
                res.status(404);
                throw new Error("Chat Not Found");
        } else {
                res.json(removed);
        }
}))

router.put('/chat/addtogroup', protect, CatchAsync(async (req, res) => {
        const { chatId, userId } = req.body;

        // check if the requester is admin

        const added = await Chat.findByIdAndUpdate(
                chatId,
                {
                        $push: { users: userId },
                },
                {
                        new: true,
                }
        )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

        if (!added) {
                res.status(404);
                throw new Error("Chat Not Found");
        } else {
                res.json(added);
        }

}))
router.get('/chats', protect, protect, CatchAsync(async (req, res) => {
        try {
                const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password")
                        .populate("latestMessage")
                        .sort({ updatedAt: -1 });

                const populatedResults = await User.populate(results, {
                        path: 'latestMessage.sender',
                        select: "firstName pic email",
                });

                res.status(200).send(populatedResults);
        } catch (error) {
                res.status(400);
                throw new Error(error.message);
        }
}));

router.get('/chat/:id', async (req, res) => {
        const singleChat = chats.find((c) => c._id === req.params.id)
        res.send(singleChat)
})







module.exports = router;