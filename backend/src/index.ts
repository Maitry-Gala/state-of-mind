import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {connectToMongoDB } from "./db.js";
import userRouter from "./routes/user.js";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1/user",userRouter);

connectToMongoDB().then(() => {
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
});

