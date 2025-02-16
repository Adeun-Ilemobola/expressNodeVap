import express from 'express';
import cors from 'cors';
import {addDays, idGenerator} from "./Utility";
import connectToDatabase from "./Configure/db";
import User from "./Configure/user";
import {DateTime} from "luxon";
import CryptoJS from "crypto-js";

import Session from "./Configure/Session";
import Note from "./Configure/Note";
import folder from "./Configure/Folder";

type INote = {
    customId: string;
    text: string;
    folderID: string;
    title: string;
}
type IFolder = {
    name: string,
    customId: string,

}

type changeDispatcher = {
    userID: string,
    userNote: { method: "add" | "delete" | "update", data: INote }[],
    userFolder: { method: "add" | "delete" | "update", data: IFolder }[],

}
const app = express();
const port = 3000;
connectToDatabase()
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

type session = {
    user: { username: string, email: string, id: string },
    id: string,
    expire: string

}

app.get('/', async (req, res) => {
    res.send('Hello, TypeScript with Express!');
});

app.post('/api/Session', async (req, res) => {
    console.log(" session validating endpoint")

    const body: session | null = req.body;
    console.log(body);
    if (!body) {
        res.status(404).send({error: "Invalid session", data: null});
        return;
    }
    try {
        const ActiveUser = await User.findOne({
            customId: body.user.id,

        })
        const getSession = await Session.findOne({
            customId: body.id
        })
        if (!ActiveUser) {
            if (getSession) {

                const item = await Session.deleteOne({
                    id: getSession.customId
                })
                console.log(" there is no user and there's a session ", item)
            }
            console.log({error: "User not found", data: null})
            res.status(404).send({error: "User not found", data: null});


            return;
        }

        if (!getSession) {
            console.log({error: "Session not found", data: null})
            res.status(404).send({error: "Session not found", data: null});
            return;
        }

        const Date = DateTime.now();
        const sessionDate = DateTime.fromISO(getSession.expire)
        console.log(sessionDate.toISO(), Date.toISO())
        console.log(sessionDate > Date)

        if (Date.toMillis() >= sessionDate.toMillis()) {
            console.log("Invalid session expired")
            res.status(400).send({error: "Invalid session expired", data: null});

            return;
        }
        console.log(" the current session is validated. It is active.")
        res.status(200).send({error: null, data: body});


    } catch (err) {
        console.log(" something went very wrong")
        console.log(err)
        res.status(500).send({error: "Invalid session", data: null});

    }


});
app.post('/api/Register', async (req, res) => {
    console.log("Register endPoint")
    const body = req.body;
    if (!body) {
        res.status(401).send({error: "Invalid body", data: null});
        return;
    }
    console.log(body)
    try {
        const user = await User.create({
            email: body.email,
            password: CryptoJS.SHA256(body.password).toString(),
            username: body.username,
            name: body.name,
        })
        if (!user) {
            res.status(400).send({error: "Invalid user the user end ", data: null});
        }
        res.status(201).json({message: "User registered successfully", data: user});


    } catch (err) {
        console.log(err)
        res.status(500).send({error: "Unable to register", data: null});
        return;
    }

})
app.post('/api/Login', async (req, res) => {
    console.log("Login endPoint")
    try {
        const body: { username: string, password: string } | null = req.body;
        console.log(body);
        if (!body) {
            res.status(401).send({error: "Invalid Credentials", data: null});
            return;
        }
//     verify the user exist

        const getUser = await User.findOne({
            username: body.username
        })

//    compare the users password to the using found password hushed
        if (!getUser) {
            res.status(400).send({error: "user not found", data: null});
            return;
        }

        const inputPassword = CryptoJS.SHA256(body.password).toString();
        if (inputPassword != getUser.password) {
            res.status(400).send({error: "Invalid password is not a much", data: null});
            return;
        }


//     the user is a much create a session to back to the user
        const startDate = DateTime.utc().plus({days: 1});
        const newSession = await Session.create({
            user: {
                username: getUser.username,
                email: getUser.email,
                id: getUser.customId,
            },
            sessionID: idGenerator(16),
            expire: startDate.toISO(),
        })

        if (!newSession) {
            res.status(400).send({error: "Invalid Session can not be make ", data: null});
            return;
        }
        res.status(201).send({
            error: null, data: {
                user: {...newSession.user},
                id: newSession.customId,
                expire: newSession.expire
            }
        });

    } catch (err) {
        res.status(500).send({error: "Unable to login", data: null});
        console.log(err)
        return;
    }


});

app.post('/api/UpdateUserData', async (req, res) => {
    const body = req.body as changeDispatcher;
    if (!body) {
        res.status(400).send({error: "Invalid body", data: null});
    }
    try{
        const {userID, userNote, userFolder} = body;


        const notePromises =  userNote.map(async (value, key) => {
            const {data} = value;

            if (value.method === "add") {
               return  Note.create({
                    text: data.text,
                    folderID: data.folderID,
                    title: data.title,
                    userID: userID,


                })

            } else if (value.method == "delete") {
                return Note.findOneAndDelete({
                    customId: data.customId
                })


            } else if (value.method == "update") {
                return Note.findOneAndUpdate({
                        customId: data.customId,
                    },
                    {
                        text:data.text,
                        title:data.title
                    }
                )

            }



        })

        const folderPromises =userFolder.map(async (value, key) => {
            const {data} = value;

            if (value.method === "add") {
                return   folder.create({
                    name: data.name,
                    userID: userID,

                })

            } else if (value.method == "delete") {
                return folder.findOneAndDelete({
                    customId: data.customId
                })


            } else if (value.method == "update") {
                return folder.findOneAndUpdate({
                        customId: data.customId,
                    },
                    {
                        name:data.name,
                    }
                )

            }


        })

        await Promise.all([...notePromises, ...folderPromises]);

        const getNote = await Note.find({
            userID: userID
        },{
            customId: 1,
            text:1,
            folderID: 1,
            userID: 1,
            title:1,
            _id:0,
        })

        const getFolder = await folder.find({
            userID: userID
        },{
            customId: 1,
             name:1,
            _id:0,
            userID: 1,
        })

        res.status(200).json({error: null, data: {
                notes:getNote,
                folders:getFolder,
            }})

    }catch(err){
        console.log(err)
        res.status(500).send({error: "Unable to register", data: null});
    }



})
app.post('/api/updateUserNotes', (req, res) => {

})

app.post('/api/testUser', async (req, res) => {
    try {
        const user = await User.create({

            username: "test",
            email: "test@test.com",
            password: "testdsfsdfdsfsd",

        })
        res.status(200).send(user)


    } catch (err) {
        console.log(err);
    }

})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});