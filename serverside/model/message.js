const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        text: {
            type: String,
            trim: true
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    },
    {
        timestamps: true,
    }

)



module.exports = mongoose.model("Message", MessageSchema)