import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import {connectToMongoDB } from "./db.js";
import userRouter from "./routes/user.js";
import cors from 'cors';
import passport from "passport";
import "./config/passport.js";
import askRouter from "./routes/ask.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/auth", askRouter);

connectToMongoDB().then(() => {
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
});

