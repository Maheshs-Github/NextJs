import z from "zod";

export const messageSchema = z.object({
  content: z.string()
  .min(10, { message: "Content msut be atleast of 10 Charcaters " })
    .max(300, { message: "Content must be of at most 300 Characters" }),
  password: z.string(),
})