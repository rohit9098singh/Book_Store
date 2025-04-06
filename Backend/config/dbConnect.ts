import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString: string | undefined = process.env.MONGODB_URI;

if (!connectionString) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
}

const connectDb = async (): Promise<void> => {
    try {
        await mongoose.connect(connectionString);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDb;
