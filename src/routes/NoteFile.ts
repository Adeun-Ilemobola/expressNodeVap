import express , { Request, Response, NextFunction  , Router  } from 'express';
import Note from "../Configure/Note";


const NotePath = Router();


NotePath.get('/', async (req, res , next) => {
    try {
        const body = req.body as {userID:string , name:string, folderID:string , text:string};
        if(body){
            console.log(" the post body is incorrect")
            res.status(401).send({error: "Invalid Credentials", data: null});
            return;
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
            return;
        }


    }catch(err){
        console.log(err)
        next();
    }
})

NotePath.post("/" , async (req, res , next) => {
    try {
        const body = req.body as {userID:string , name:string, folderID:string ,};
        console.log(body);
        
        if(!body){
            console.log("the post body is incorrect")
            res.status(401).send({error: "Invalid Credentials", data: null});
            return;
        }

        const  {userID  , folderID   , name} = body;

        const op= await Note.create({
            userId:userID,
            text:"",
            folderID:folderID,
            title:name
        })

        if (op){
            res.status(201).send({error: null, data: "Successfully added note:" +op.title })
            return;
        } else {
            res.status(401).send({error: "something went wrong", data: null});
            return;
        }
        
    } catch (error) {
        console.log(error)
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
            return;
        }

        const note = await Note.findOneAndUpdate({
            customId:id,
            userId:userID,
        },{
            text:text,
            title:name,
            },
            {
                new: true
            }

        )

        if (!note){
            res.status(401).send({error: "something went wrong", data: null});
            return;

        }

        res.status(200).send({error: null, data: "successfully updated"});
        return;

    }catch(err){
        console.log(err)
        next();

    }

})

NotePath.delete('/:id/:userId', async (req, res , next) => {
    try{
        const {id , userId} = req.params;
        console.log(
            "delete---",
            id,
           userId
        );
       if (!(id && userId)){
           res.status(401).send({error: "Invalid Credentials", data: null});
           return;
       }

       const note = await Note.findOneAndDelete({
           customId:id,
           userId:userId,
       } , {new: true})
       if (!note){
           res.status(401).send({error: "something went wrong", data: null});
           return;
       }
       res.status(200).send({error: null, data: "Successfully deleted"})
       return;
    }catch(err){
        console.log(err)
        next();
    }
})


export default NotePath;



