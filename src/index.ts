import express from 'express';
import cors from 'cors';
import {addDays} from "./Utility";
import connectToDatabase from "./Configure/db";
import User from "./Configure/user";

const app = express();
const port = 3000;
connectToDatabase()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

type session = {
    user: { username: string ,    email: string ,    id: string },
    sessionID: string,
    Expire: number

}

app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});

app.get('/api/verifySession', (req, res) => {
    const body:session | null  = req.body;
    if (!body) {
        res.status(200).send({error: "Invalid session "});
    }





});
app.post('/api/Login', (req, res) => {
    const body:{username:string ,password:string}| null = req.body;
    if (!body){
        res.status(401).send({error:'Invalid Credentials'});
        return;
    }
//     verify the user exist

//    compare the users password to the using found password hushed


//     the user is a much create a session to back to the user
    const op = true;
    const startDate = new Date();

    if (op){
        res.status(200).send({
            user:{
                username: body.username,
                email:"test@test.com",
                id:"test@test.com",
            },
            sessionID:"43858pereugfiusodisiodfguos",
            Expire:addDays(startDate , 1).getMilliseconds()
        })
    }


});


app.post('/api/updateUserNotes', (req, res) => {

})

app.post('/api/testUser', async (req, res) => {
    try{
      const user =  await  User.create({

            username: "test",
            email: "test@test.com",
            password: "testdsfsdfdsfsd",

        })
        res.status(200).send(user)


    }catch(err){
        console.log(err);
    }

})



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});