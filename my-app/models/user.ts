// so we are like in models/user, use dto create the models(documents) that is all

import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
  content: string;
  createdAt: Date
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})



export interface User extends Document {
  username: string;
  email: string,
  password: string;
  verifyCode: string;
  verifyExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

// so 1 question how do we uses those Data Types , yantx and meaning in below one Schema<User> ?
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is Required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      , "Enter the Valid Email Address"]
  },
  password: {
    type: String,
    required: [true, "Password is Required"]
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"]
  },
  verifyExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"]
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },
  messages: {
    type: [MessageSchema] //so interface is not a type MessageSchema which is mongoose Schema 
  }

})

// actually do not understood , if there is no documnet in tge collection 1st one , if there is 2nd one , not sure about it ?
// also the Syantx , 1st tells User model which is mongoose model of type User ,2nd user model name and it's Schema 
const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;