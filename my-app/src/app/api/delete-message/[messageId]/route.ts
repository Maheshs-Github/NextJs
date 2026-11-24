import dbConnect from "@/src/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/src/models/user";

export async function DELETE(request:Request, {params}:{params:{messageId:string}}){
  const {messageId}=params;
  await dbConnect();
  const session=await getServerSession(authOptions);
  const user:User=session?.user as User;

  if(!session || !user){
    return Response.json({
      success:false,
      message:"Not Authenticated"},{status:401})
    }
    try {
      const updatedContent=await UserModel.updateOne({_id:user?._id},{$pull:{messages:{_id:new mongoose.Types.ObjectId(messageId)}}});
      if(updatedContent.modifiedCount===0){
        return Response.json({
          success:false,
          message:"Message not found or Already deleted"
        },{status:404})
      }
      return Response.json({
        success:true,
        message:"Message deleted successfully"
      },{status:200})
    } catch (error) {
      return Response.json({
        success:false,
        message:"Error while deleting the Message"
      },{status:500})
    }



}