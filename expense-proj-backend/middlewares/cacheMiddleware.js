import {client} from "../config/redis.js";

export const cacheMiddleware=async (req,res,next)=>{
const userID=req.user.id;
const cached= await client.get(`user:${userID}`);
if(cached){
    console.log("cache hit!!");
    const userData = JSON.parse(cached);
    return res.status(200).json({
        ...userData,
        message: "from cache yeeyy!!!"
    });
}
next();
}