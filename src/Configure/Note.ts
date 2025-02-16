import mongoose, {Schema, Document} from "mongoose";
import {idGenerator} from "../Utility";
import {DateTime} from "luxon";
import {ISession} from "./Session"; // npm install --save luxon

export interface INote extends Document {
    customId: string,
    title: string,
    text: string,
    folderID: string,
    userId: string,

}


const NoteSchema = new Schema({
    customId: {
        type: String,
        unique: true,
        default: () => idGenerator(14),
    },
    text:{
        type: String,
    },
    title:{
        type: String,
    },
    folderID:{
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true,
    }


})




export default  mongoose.model<INote>("Note", NoteSchema);




