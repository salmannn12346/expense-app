import expenseModel from "../models/expenseModel.js"
export const createExpense =async (req,res)=>{
 const id=req.user.id;
 const {title,amount,category}=req.body;
 if(!title || !amount || !category){
    return res.status(400).json({message:"all fields required"});
 }
 try{
    const exprense= await expenseModel.create({
         user:id,
           title,
           amount,
           category
    })
     res.status(200).json({message:`expense created  ${exprense}`});
 }
 catch(err){
return res.status(500).json({message:err.message});
 }

}

export const getExpenses =async (req,res)=>{
   const {category}=req.query;
     const filter ={
      user:req.user.id
     };
     if(category){
      filter.category=category;
     }
     try{
     const expenses=await expenseModel.find(filter); 
      res.status(200).json(expenses);
     }
     catch(err){
        return res.status(500).json({message:err.message});
     }
}

export const deleteExpense=async(req,res)=>{
   const id=req.params.id;
  try{
  const deletedExpense=await expenseModel.findByIdAndDelete(id);
  if(!deletedExpense){ return res.status(500).json({message:"failed to delete"})}
 return res.status(200).json({message:"successfull deletion"});
  }
  
  catch(err){
  res.status(500).json({message:"failed to delete"})
  }
}

export const editExpense=async(req,res)=>{
   const id=req.params.id;
  try{
  const editedExpense=await expenseModel.findByIdAndUpdate(id,req.body,{new:true});
  if(!editedExpense){return res.status(404).json({message:"expense not found"})}
 return res.status(200).json({message:"successfull updated",expense:editedExpense});
  }
  
  catch(err){
  res.status(500).json({message:"failed to update"})
  }
}