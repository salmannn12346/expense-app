import authModel from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateAccessToken=(id)=>{
return jwt.sign({id},"jwt_Secret",{expiresIn:"15m"});
}
const generateRefreshToken=(id)=>{
return jwt.sign({id},"refresh_Secret",{expiresIn:"7d"});
}

export const signUp=async (req,res)=>{
    try{
     const {name ,email,password}=req.body;
     if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"})
     }
     const userExist=await authModel.findOne({email});
     if(userExist){
   return res.status(409).json({message:"user already exist"});
     }
const hashedPassword=await bcrypt.hash(password,10);
const user=await authModel.create({
    name,
    email,
    password:hashedPassword
});
const refreshToken=generateRefreshToken(user._id);
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        samseSite:"lax",
        secure:false
    });
const token =generateAccessToken(user._id);
res.status(201).json({message:"user created",
    token,
    user:{id:user._id,
          name:user.name,
          email:user.email
    }});
    }
    catch(e){
res.status(500).json({error:e.message});
    }
}



export const login=async (req,res)=>{
   try{
     const {email,password}=req.body;
     if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
     }
     const user=await authModel.findOne({email});
     if(!user){  
   return res.status(401).json({message:"Invalid credentials"});
     }
const isMatch=await bcrypt.compare(password,user.password);
if(!isMatch){
  return res.status(401).json({message:"Invalid credentials"});
}
const refreshToken=generateRefreshToken(user._id);
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    });
const token =generateAccessToken(user._id);
res.status(200).json({message:"login successfull",
    token,
    user:{id:user._id,
          name:user.name,
          email:user.email
    }
});

    }
    catch(e){
res.status(500).json({error:e.message});
    }
}

export const refresh =async(req,res)=>{
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
   return res.status(401).json({message:"unauthorized"});
    }
    try{
        const decoded=jwt.verify(refreshToken,"refresh_Secret");
        const user=await authModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({message:"user not found"});
        }
        const token=generateAccessToken(user._id);
        res.status(200).json({token});
    }
    catch(err){
    return res.status(401).json({message:"invalid refresh token"});
    }
}

export const logout=(req,res)=>{
  res.clearCookie("refreshToken",{
    httpOnly:true,
    sameSite:"lax",
    secure:false
  });
  res.status(200).json({message:"logged out"});
}