import mongoose from "mongoose";
const expenseSchema=new mongoose.Schema({
   user:{type:mongoose.Schema.Types.ObjectId,ref:"user" },
   title:{type:String,required:true},
   amount:{type:Number,required:true},
   category:{type:String,required:true},
   date:{type:Date,default:Date.now}
});
const expenseModel=mongoose.model("expense",expenseSchema);

export default expenseModel;