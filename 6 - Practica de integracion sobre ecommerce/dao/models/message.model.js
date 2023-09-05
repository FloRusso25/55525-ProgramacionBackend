import mongoose from "mongoose"
import pkg from 'validator'
const { isEmail } = pkg

const messagesCollection = 'messages'

const messageSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    message: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true,
        validate: [ isEmail, 'invalid email' ]
    }
})

const messageModel = mongoose.model(messagesCollection, messageSchema)

export default messageModel