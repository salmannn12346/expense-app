import {client} from "../config/redis.js";
export const ratelimitter =async(req,res,next)=>{
const ip=req.ip;
const bucketData= await client.get(`rateLimit:${ip}`)
let bucket;
if(!bucketData){
 bucket={
   tokens:5,
   lastRefill:Date.now()
 }
}
else{
   bucket=JSON.parse(bucketData);
}

 const elapsedtime= Date.now() -bucket.lastRefill ;
 const refilltokens=Math.floor(elapsedtime/60000);
 if(refilltokens>0){
  bucket.tokens=Math.min(5,bucket.tokens+refilltokens);
  bucket.lastRefill+=refilltokens*60000;
 }
 
 if(bucket.tokens<=0){
 return res.status(429).json({message:"too many request ,try again later"});
 }
 bucket.tokens--;
 await client.set(`rateLimit:${ip}`,JSON.stringify(bucket),
 {EX:300})


next();

}