import dbConnect from "@/src/lib/dbConnect";
import UserModel, { Message } from "@/src/models/user";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request:Request){
  await dbConnect();
  const {username,content}=await request.json();
  try {
    const user=await UserModel.findOne({username});
    if(!user){
      return NextResponse.json({
        success:false,
        message:"User not found"
      },{status:401})
    }
    if(!user.isAcceptingMessage){
      return NextResponse.json({
        success:false,
        message:"user is not accepting the messages "
      },{status:403})
    }

    const newMessage={content, createdAt:new Date()};
    user.messages.push(newMessage as Message);

    await user.save();

    return NextResponse.json({
      success:true,
      message:"Message Sent Successfully"
    },{status:200})
  } catch (error) {
    return NextResponse.json({
      success:false,
      message:"Error while Sending the Message"
    },{status:500})
  }
}