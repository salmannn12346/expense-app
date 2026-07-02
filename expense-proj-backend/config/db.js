import mongoose from "mongoose";

const mongo_url="mongodb+srv://ApliLeranUserName:ApliLeranUserName123456@salmnndb.mte3jvs.mongodb.net";
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