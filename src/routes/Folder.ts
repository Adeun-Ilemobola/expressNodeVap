import { Router } from 'express';
import Folder from '../Configure/Folder';




const FolderPath = Router();


FolderPath.post('/' ,async(req, res , next) => {
     try{
        const body = req.body as {userId:string , name:string, };
        if(!body){
            console.log("the post body is incorrect")
            res.status(401).send({error: "Invalid Credentials", data: null});


        }

        const {userId , name } = body;

        const folder = await Folder.create({
            userId:userId,
            name:name,
            
        })

        if(!folder){
          res.status(401).send({error: "something went wrong", data: null});
        }
        res.status(201).send({error: null, data: "Successfully added folder:" +folder.name })

     }catch(err){
         console.log(err)
         next();
     }
})

FolderPath.delete('/:id/:userId' ,async (req, res , next) => {
     try{
        const {id, userId} = req.params;
       if (!(id && userId)){
           res.status(401).send({error: "Invalid Credentials", data: null});
       }

       const folder = await Folder.findOneAndDelete({
           customId:id,
           userId:userId,
       })

       if(!folder){
           res.status(401).send({error: "Folder not found", data: null});
       }

       res.status(200).send({error: null, data: "Folder successfully deleted" })

     }catch(err){
         console.log(err)
         next();
     }

})


export default FolderPath;
