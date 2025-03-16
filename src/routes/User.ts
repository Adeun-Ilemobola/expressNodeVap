import express, { Request, Response, NextFunction, Router } from 'express';
import user from '../Configure/user';
import CryptoJS from "crypto-js";
import { log } from 'console';


const UserRoute = Router();
UserRoute.get('/:id', async (req, res, next) => {
     const { id } = req.params
     try {
          if (!id) {
               res.status(401).send({ error: "Invalid Credentials", data: null })
               return;
          }
          const CurUser = await user.findOne({
               customId: id,
          }
          )
          if (!CurUser) {
               res.status(401).send({ error: "User not found ", data: null })
               return;

          }

          res.status(200).send({ error: null, data: {
               username: CurUser.username,
               email: CurUser.email,
               
          } })

          return;

     } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Unable to get the user with the id of " + id, data: null })


     }
})



UserRoute.put('/:id', async (req, res, next) => {
     const { id } = req.params
     const body = req.body as {username:string , password:string , email:string , newPassword:string , oldPassword:string , passwordConfirm:string , isNewpassword:boolean}
     console.log(body);
     
     try {
          if (!id || !body) {
               console.log("body is not defined, and the ID is also not defined");
               
               res.status(401).send({ error: "Invalid Credentials", data: null })
               return;
          }
          const getUser = await user.findOne({
               customId: id,
          })
          if (!getUser) {
               console.log("User not found");
               
               res.status(401).send({ error: "User not found ", data: null })
               return;

          }
          let haspassword = body.isNewpassword ? CryptoJS.SHA256(body.newPassword).toString() : getUser.password;

          if (body.isNewpassword){
               console.log("New password");
               if (body.oldPassword && getUser.password){
                    if ( CryptoJS.SHA256(body.oldPassword).toString() === getUser.password) {
                         console.log("This is the same password");
                         res.status(401).send({ error: "This is the same password", data: null })
                         return;
                    }

               }
               
               if (body.passwordConfirm !== body.newPassword) {
                    console.log("Password and confirm password does not match");
                    res.status(401).send({ error: "Password and confirm password does not match", data: null })
                    return;
               }
          }

         
          const CrrUser = await user.findOneAndUpdate({
               customId: id,
          }
               , {
                    username: body.username,
                    password: haspassword,
                    email: body.email,
                    
               },
               {
                    new: true,
               
               }

          )
          if (!CrrUser) {

               console.log("Unable to update the user");
               res.status(401).send({ error: "Unable to update the user", data: null })
               return;

          }


          console.log("Updated");
          
          res.status(200).send({ error: null, data: CrrUser })

          return;

     } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Unable to update the user with the id of " + id, data: null })
          next(err);



     }
})





export default UserRoute;