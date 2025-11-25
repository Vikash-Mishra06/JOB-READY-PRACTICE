import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String
    }
})

const User = new mongoose.model('User', authSchema)

export default User