import dbConnect from "@/src/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import UserModel from "@/src/models/user";

export async function GET(request:Request){
  await dbConnect();
  const session=await getServerSession(authOptions);
  const user:User=session?.user as User;

  if(!session || !user){
    return NextResponse.json({
      success:false,
      message:"Not Authenticated"},{status:401})
    }

    try {
      const foundUser=await UserModel.findById(user._id).select("messages").lean();

      if(!foundUser){
        return NextResponse.json({
          success:false,
          message:"User not found"
        },{status:404})
      }
      const messages=[...(foundUser.messages ?? [])].sort(
        (first,second)=>new Date(second.createdAt).getTime()-new Date(first.createdAt).getTime()
      );
      return NextResponse.json({
          success:true,
          messages
        },{status:200})
      
    } catch (error) {
      return NextResponse.json({
      success:false,
      message:"Error while getting the Message"
    },{status:500})
    }

}
