import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET;
import  {Router, type Request, type Response } from "express";
import { UserModel,TagModel,linkModel,connectToMongoDB,contentModel } from "../db.js";

const userRouter: Router = Router();

userRouter.post("/api/v1/signup",(req: Request,res: Response)=>{

});

userRouter.post("/api/v1/signin",( req:Request,res:Response)=>{

});

userRouter.post("/api/v1/content",( req:Request,res:Response)=>{

});

userRouter.get("/api/v1/content",( req:Request,res:Response)=>{

});

userRouter.delete("/api/v1/content",( req:Request,res:Response)=>{

});

userRouter.post("/api/v1/brain/share",( req:Request,res:Response)=>{

});

userRouter.get("/api/v1/brain/:shareLine",( req:Request,res:Response)=>{

});

export default userRouter;