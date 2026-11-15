import dbConnect from "@/src/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/src/models/user";
import { success } from "zod";

export async function GET(request:Request){
  await dbConnect();
  const session=await getServerSession(authOptions);
  const user:User=session?.user as User;

  if(!session || !user){
    return NextResponse.json({
      success:false,
      message:"Not Authenticated"},{status:401})
    }

    const userId=new mongoose.Types.ObjectId(user._id);

    try {

      const user=await UserModel.aggregate([
        {$match:{_id:userId}},
        {$unwind:"$messages"},
        {$sort:{"messages.createdAt":-1}},
        {$group:{_id:"$_id",messages:{$push:"$messages"}}}
      ])

      if(!user || user.length===0){
        return NextResponse.json({
          success:false,
          message:"User not found"
        },{status:401})
      }
              return NextResponse.json({
          success:true,
          messages:user[0].messages
        },{status:200})
      
    } catch (error) {
      return NextResponse.json({
      success:false,
      message:"Error while getting the Message"
    },{status:500})
    }

}