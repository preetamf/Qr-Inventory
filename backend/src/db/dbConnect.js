import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // console.log("DB URL: ", process.env.MONGODB_URL)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        // console.log("connectionInstance: ", connectionInstance)
        console.log("MongoDb Connected successfuly: ", connectionInstance.connection.host)
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
}

export default connectDB;