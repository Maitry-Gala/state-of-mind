import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const {Schema,Types} = mongoose;
const  ObjectId = Types.ObjectId;
const Dburl = process.env.Dburl;

const UserSchema = new Schema({
    email : {type: String, unique: true,required: true},
    password : {type: String, required : true},
    firstName : {type: String,required : true},
    lastName : {type: String},
});

const TagSchema = new Schema({
    title : {type: String,required:true, unique: true}
});

const contentType = ['image','video','article','audio'];
const ContentSchema = new Schema({
    link: {type:String,required: true},
    type: {type: String, enum: contentType, required: true},
    title:{type: String,required:true},
    description: { type: String },
    tags:[{type: ObjectId,ref:'Tag'}],
    userId:{ type: ObjectId, ref: 'User',required: true},
});

const linkSchema = new Schema({
    hash :{type: String,required: true,unique: true},
    userId:{type: ObjectId, ref: 'User',required: true},
});

export async function connectToMongoDB(){
    try{
        if(Dburl == undefined){
            throw new Error;
        }
        await mongoose.connect(Dburl);
        console.log("connected to database");
    }catch(e){
        console.log("Error occurred",e);
    }
}

export const UserModel = mongoose.model('User',UserSchema);
export const TagModel = mongoose.model('Tag',TagSchema);
export const contentModel = mongoose.model('content',ContentSchema);
export const linkModel = mongoose.model('link',linkSchema);


