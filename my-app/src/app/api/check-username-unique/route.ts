import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/user";
import { usernameValidation } from "@/src/schemas/signupSchema";
import { NextResponse } from "next/server";
import z, { success } from "zod";

const usernameQuerySchema=z.object({
  username:usernameValidation
})

export async function GET(request:Request) {

  // actually it is already showing but for the Method not allowed but this can be used 
  // if(request.method!!=="GET"){
  //   return NextResponse.json({
  //     success:false,
  //     message:"Method not allowed"
  //   },{status:405})
  // }
  await dbConnect();
  // localhost:3000/api/sign-up?username=hitesh?phone=android
  // so here username and phone is a queryparams
  try {
    const {searchParams}=new URL(request.url)
    const queryParam={
      username:searchParams.get('username')
    }
    const result=usernameQuerySchema.safeParse(queryParam)
    console.log("result: ",result)
    console.log("result: ",result.error?.format().username)
//     result:  {
//   _errors: [
//     'Username must be at least 2 characters',
//     'Username must not contain special characters'
//   ]
// }

    if(!result.success){
      const usernameErrors=result.error.format().username?._errors || []
      return NextResponse.json({
        success:false,
        message:usernameErrors.length>0?
        usernameErrors.join(", ")
        :"InValid Query Parameters"
      },{status:400})
    }
    const {username}=result.data;

    const existingVerifiedUser=await UserModel.findOne({username,isVerified:true})

    if(existingVerifiedUser){
      return Response.json({
        success:false,
        message:"Username is already taken"},{status:400})
      }

      return NextResponse.json({
        success:true,
        message:"Username is a Unique",
      },{status:200})
  } catch (error) {
    console.log("Error while Checking the username: ",error)

    return Response.json({
      success:false,
      message:"Error While Checking the username"
    },
  {status:500})
    
  }
}