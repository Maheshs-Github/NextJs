import dbConnect from "@/src/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { success } from "zod";
import UserModel from "@/src/models/user";
import { usernameValidation } from "@/src/schemas/signupSchema";

export async function POST(request:Request) {
  await dbConnect();
  const session=await getServerSession(authOptions);
  const user:User=session?.user as User;

  if(!session || !user)
    return NextResponse.json({
  success:false,
message:"Not Authenticated"},{status:401})

const userId=user._id;
const {isAcceptingMessage}=await request.json()

try {
  const updatedUser=await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage},{new:true})

  if(updatedUser)
  {
    return NextResponse.json({
      success:true,
      message:"Accepting Message Status Updated Successfully"
    },{status:200})
  }
  else{ 
    return NextResponse.json({
      success:false,
      message:"Failed to Update Accepting Message Status "
    },{status:401})
  }

} catch (error) {
    console.log("failed to update user status to accept messages ")
  return Response.json({
    success:false,
    message:"Not Authenticated"
  },{status:500})
}
}


export async function GET(request:Request) {
  await dbConnect();
  const session=await getServerSession(authOptions);
  const user:User=session?.user as User;

  if(!session || !user){
    return NextResponse.json({
  success:false,
message:"Not Authenticated"},{status:401})
    }
const userId=user._id;
try {

const foundUser=await UserModel.findById(userId);

  if(!foundUser){
    return NextResponse.json({
      success:false,
      message:"User not found"
    },{status:404})
  }

  return NextResponse.json({
    success:true,
    isAcceptingMessage:foundUser.isAcceptingMessage,
  },{status:200})
  } catch (error) {
    return NextResponse.json({
      success:false,
      message:"failed to get the Message Acceptance status"
    },{status:500})
    
  }


}