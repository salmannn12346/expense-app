import mongoose from "mongoose";

const mongo_url=process.env.MONGO_URI;
const dbConnect=async ()=>{
  try{
    await mongoose.connect(mongo_url);
    console.log("database connected");
  }
  catch(e){
    console.log(e.message);
  }
}
export default dbConnect;