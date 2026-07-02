import {createClient} from "redis";
export const client =createClient();

client.on("error",(err)=>{
    console.log("Redis error :"+err);
})

export const connectRedis=async()=>{
await client.connect();
console.log("Redis connected");
}
