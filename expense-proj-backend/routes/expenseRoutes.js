import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"
import {createExpense,getExpenses,deleteExpense,editExpense} from "../controllers/expenseController.js"
const expenseRouter =express.Router();
expenseRouter.use(authMiddleware);
expenseRouter.post("/createExpense",createExpense);
expenseRouter.get("/getExpenses",getExpenses);
expenseRouter.delete("/deleteExpense/:id",deleteExpense);
expenseRouter.put("/editExpense/:id",editExpense);
export default expenseRouter;