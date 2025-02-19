
import mongoose,{Document, Schema} from "mongoose";
import {idGenerator} from "../Utility";

export interface IFolder extends Document {
    customId: string,
    name: string,
    userId: string


}


const FolderSchema = new Schema({
    customId: {
        type: String,
        unique: true,
        default: () => idGenerator(14),
    },
    name:{
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true,
    }

})

export  default  mongoose.model<IFolder>("Folder", FolderSchema);