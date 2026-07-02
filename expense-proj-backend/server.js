import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import expenseRouter from "./routes/expenseRoutes.js";
import {connectRedis} from "./config/redis.js"
dotenv.config();
const app = express();
const port = process.env.PORT;
await dbConnect();
await connectRedis();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5501",
    credentials: true
}));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/expense",expenseRouter);
app.get("/", (req, res) => {
    res.json({ message: "welcome to salmnns server!!" });
})
app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})