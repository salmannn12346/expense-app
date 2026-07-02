import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {profile,dashboard} from "../controllers/userControllers.js"
const router =express.Router()
router.use(authMiddleware);
router.get("/",(req,res)=>{
    res.json({message:"dashboardd!!"});
});
router.get("/profile",profile);
router.get("/dashboard",dashboard);
export default router;