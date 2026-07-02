import express from "express";
import {signUp,login,refresh,logout} from "../controllers/authController.js";
import {getUserData} from "../controllers/userControllers.js";
import {ratelimitter} from "../middlewares/rateLimitterMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {cacheMiddleware} from "../middlewares/cacheMiddleware.js";
const router=express.Router();
router.get("/",(req,res)=>{
    res.send("<h1>Authenticationnn</h1>");
});
router.post("/signUp",ratelimitter,signUp);
router.post("/login",ratelimitter,login);
router.get("/me",authMiddleware,cacheMiddleware,getUserData);
router.post("/refresh",refresh);
router.post("/logout",logout);
export default router;
