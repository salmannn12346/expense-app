import mongoose from "mongoose";
const authSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
});
const authModel=mongoose.model("user",authSchema);
export default authModel;