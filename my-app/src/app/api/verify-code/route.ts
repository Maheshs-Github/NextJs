import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/user";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request:Request) {
  await dbConnect();

  try {
  const {username,code}=await request.json();
  const decodedUsername=decodeURIComponent(username);
  const user=await UserModel.findOne({username:decodedUsername});

  if(!user){
    return NextResponse.json({
      success:false,
      message:"User not found"},
      {status:404})
    }

    const isCodeValid=user.verifyCode===code;
    const isCodeNotExpired=new Date(user.verifyExpiry)>new Date();

    if(isCodeValid && isCodeNotExpired)
    {
      user.isVerified=true;
      await user.save()

      return NextResponse.json({
        success:true,
        message:"Code verified Successfully",
      },{status:200})
    }
    else if(!isCodeValid){
      return NextResponse.json({
        success:false,
        message:"Verification Code is Invalid"
      },{status:400})
    }
    else if(!isCodeNotExpired){
      return NextResponse.json({
        success:false,
        message:"Verification Code has been  Expired, plz sign up agian to get the new code"
      },{status:400})
    }

  } catch (error:any) {
    return NextResponse.json({
      success:false,
      message:"Error Verifying Code"
    },{status:500})
  }
  
}