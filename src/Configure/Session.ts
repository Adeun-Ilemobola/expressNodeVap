import mongoose, {Schema, Document} from "mongoose";
import {idGenerator} from "../Utility";
import {DateTime} from "luxon"; // npm install --save luxon


// Define the User Interface
export interface ISession extends Document {
    customId: string,
    expire: string,
    user: {
        username: string,
        email: string,
        id: string

    }
}

const Sessionschema = new Schema({
    customId: {
        type: String,
        unique: true,
        default: () => idGenerator(14),
    },
    expire: {
        type: String,
        default: () => {
            const d = DateTime.now()
            d.plus({day: 1})
            return d.toISO()
        },
    },
    user: {
        username: {
            type: String,
        },
        email: {
            type: String
        },
        id: {
            type: String,
        }

    }
})

export default mongoose.model<ISession>("Sessions", Sessionschema);
