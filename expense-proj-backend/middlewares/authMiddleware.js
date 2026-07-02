import jwt from "jsonwebtoken";
import authModel from "../models/authModel.js";
 const authMiddleware=async(req,res,next)=>{
const authHeader=req.headers.authorization;
if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({message:"no token, unauthorized"});
}
const token=authHeader.split(" ")[1];
try{
const decoded=jwt.verify(token,"jwt_Secret");
const user= await authModel.findById(decoded.id);
if(!user){
    return res.status(401).json({message:"user not found"});
}
req.user=decoded;
next();

}
catch(e){
return res.status(401).json({message:"invalid or expired token"})
}

}
export default authMiddleware;