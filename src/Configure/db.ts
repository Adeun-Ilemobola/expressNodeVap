require('dotenv').config()
import mongoose from 'mongoose';

const dbUrl: string = process.env.MONGO_DB_URI as string;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to the db");
    } catch (err) {
        console.error("Failed to connect to the db", err);
    }
};

export default connectToDatabase