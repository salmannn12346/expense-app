import authModel from "../models/authModel.js"
import {client} from "../config/redis.js"
export const profile=(req,res)=>{
return res.status(200).json({
    message:`profile !! user with id ${req.user.id}` 
})
}
export const dashboard=(req,res)=>{
return res.status(200).json({
    message:`dashboard !! user with id ${req.user.id}` 
})
}

export const getUserData=async (req,res)=>{
    try{
const id=req.user.id;
const userData= await authModel.findById(id);
if(!userData){
   return res.status(404).json({message:"user not found"})
}
await client.set(`user:${id}`,JSON.stringify({id:userData._id,
          name:userData.name,
          email:userData.email
    }),{EX:600})

res.status(200).json({id:userData._id,
          name:userData.name,
          email:userData.email
    });}
catch(err){
    res.status(500).json({message:"server error"})
}
}
