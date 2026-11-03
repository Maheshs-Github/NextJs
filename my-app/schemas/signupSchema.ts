import z from "zod";

export const usernameValidation=
z.string()
.min(2,"username must be atleast 2 Characters")
.max(20,"username must be atmost 20 Characters")
.regex(/[^A-Za-z0-9]/,"username must contain sepcial characters")

export const signUpSchema=z.object({
  username:usernameValidation,
  email:z.string().email({message:"Invalid Email Address"}),
  password:z.string().min(6,{message:"Password must be at least 6 charcters"})
})