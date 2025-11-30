import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to DB')
    } catch (error) {
        console.log('Failed to ConnectDB', error)
    }
}

export default connectDB