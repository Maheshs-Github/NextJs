import z from "zod";
import { usernameValidation } from "./signupSchema";

export const verifySchema=z.object({
  username:usernameValidation,
  code:z.string().length(6,"Verification Code is of 6 digits")
})