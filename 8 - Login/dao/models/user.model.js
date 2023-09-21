import mongoose from "mongoose"
import pkg from 'validator'
const { isEmail } = pkg

const usersCollection = 'users'

const userSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [ isEmail, 'invalid email' ],
        unique: true
    },
    role: {
        type: String,
        default: "user"
    }

})

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel