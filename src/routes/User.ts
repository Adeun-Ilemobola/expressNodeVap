import express , { Request, Response, NextFunction  , Router  } from 'express';
import user from '../Configure/user';


const UserRoute = Router();
UserRoute.get('/:id' , async(req, res , next)=>{
     const {id } = req.params
     try{
          if (!id ){
               res.status(401).send({error: "Invalid Credentials", data: null})
               return;
          }
          const CurUser = await  user.findOne({
               customId:id ,
          },{
               customId:1,
               username:1,
               _id:0

          }
     )
          if (!CurUser){
               res.status(401).send({error: "User not found ", data: null})
               return;

          }

          res.status(200).send({error:null, data: CurUser})

          return;

     }catch(err){
          console.log(err);
          res.status(500).send({error: "Unable to get the user with the id of " + id, data: null})
          

     }
})