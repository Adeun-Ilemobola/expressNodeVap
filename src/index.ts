import express from 'express';
import cors from 'cors';
import {addDays, idGenerator} from "./Utility";
import connectToDatabase from "./Configure/db";
import User from "./Configure/user";
import {DateTime} from "luxon";
import CryptoJS from "crypto-js";

import Session from "./Configure/Session";
import Note from "./Configure/Note";
import Folder from "./Configure/Folder";

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
        await Session.deleteMany({
            "user.id": getUser.customId
        })


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

app.post('/api/userCollection',async (req, res) => {
    try {
        const {userID} = req.body as {userID:string};
        if (!userID) {
            res.status(401).send({error: "Invalid Credentials", data: null});
            return;
        }

        const note = await Note.find({
            userId: userID
        },{
            customId: 1,
            text:1,
            title:1,
            folderID: 1,
            userId: 1,
            _id:0
        })

        const  folder = await Folder.find({
            userId: userID

        },{
            customId: 1,
            name:1,
            userID: 1,
        })


        const NoteFormat = note.map(op=>{
            return {
                id:op.customId,
                userId:op.userId,
                text:op.text,
                folderID:op.folderID,
                name:op.title,
            }
        })


        const FolderFormat = folder.map(op=>{
            return {
                id:op.customId,
                userId:op.userId,
                name:op.name,
            }
        })

        const struct = FolderFormat.map(item=>{
            const kid = NoteFormat.filter(note=>note.folderID===item.id)
            return {
                id:item.id,
                name:item.name,
                Children:[
                    ...kid.map(child=>({id:child.id, name:child.name})),
                ]
            }
        })


        res.status(200).json({error: null, data: {
                notesA:NoteFormat,
                folderA:FolderFormat,
                struct:struct
            }})



    }catch(err){
        console.log(err)
        res.status(500).send({error: "something went wrong", data: null});


    }

})

app.post('/api/userFolder',async (req, res) => {
    try{
        const body = req.body as {userID:string , method:"add" | "update"|"delete" , name:string,};
        console.log(body);
        if  (!body) {
            console.log(" the post body is incorrect")
            res.status(401).send({error: "Invalid Credentials", data: null});
            return;
        }
        const {userID , method , name} = body;


        if (method === "add") {
           const op= await Folder.create({
               userId:userID,
               name:name,
            })

            if (op){
                res.status(201).send({error: null, data: "successfully added folder:" +op.name })
            }

        }

    }catch(err){
        console.log(err)
        res.status(500).send({error: "Invalid Credentials", data: null});
        return;
    }
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