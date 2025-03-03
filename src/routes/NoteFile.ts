import express , { Request, Response, NextFunction  , Router  } from 'express';
import Note from "../Configure/Note";


const NotePath = Router();



NotePath.get('/', async (req, res , next) => {
    try {
        const body = req.body as {userID:string , name:string, folderID:string , text:string};
        if(body){
            console.log(" the post body is incorrect")
            res.status(401).send({error: "Invalid Credentials", data: null});
        }

        const  {userID , text , folderID   , name} = body;

        const op= await Note.create({
            userId:userID,
            title:name,
            text:text,
            folderID:folderID
        })

        if (op){
            res.status(201).send({error: null, data: "successfully added note:" +op.title })
            return;
        }else {
            res.status(401).send({error: "something went wrong", data: null});
        }


    }catch(err){
        console.log(err)
        next();
    }
})

NotePath.put('/:id', async (req, res , next) => {
    try {
        const {id} = req.params;
        const {userID , text,   name} = req.body as {userID:string , text:string, name :string} ;
        console.log(
            id,
           { userID,
            text,
            name,}
        );
        
        if (!(id && userID && text)){
            res.status(401).send({error: "Invalid Credentials", data: null});
        }

        const note = await Note.findOneAndUpdate({
            customId:id,
            userId:userID,
        },{
            text:text,
            name:name,
            },
            {
                new: true
            }

        )

        if (!note){
            res.status(401).send({error: "something went wrong", data: null});

        }

        res.status(200).send({error: null, data: "successfully updated"});

    }catch(err){
        console.log(err)
        next();

    }

})

NotePath.delete('/:id/:userId', async (req, res , next) => {
    try{
        const {id , userId} = req.params;
       if (!(id && userId)){
           res.status(401).send({error: "Invalid Credentials", data: null});
       }

       const note = await Note.findOneAndDelete({
           customId:id,
           userId:userId,
       } , {new: true})
       if (!note){
           res.status(401).send({error: "something went wrong", data: null});
       }
    }catch(err){
        console.log(err)
        next();
    }
})


export default NotePath;



