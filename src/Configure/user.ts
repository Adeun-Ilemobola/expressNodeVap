import mongoose, { Schema, Document } from "mongoose";
import {idGenerator} from "../Utility";

// Define the User Interface
export interface IUser extends Document {
    customId: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}

// Define the User Schema
const UserSchema: Schema = new Schema({
    customId: {
        type: String,
        unique: true,
        default: () => idGenerator(14),
    },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Export the Model
export default mongoose.model<IUser>("User", UserSchema);
