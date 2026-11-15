import { NextResponse } from "next/server";
import { gemini } from "../../../lib/gemini";
import { ApiError } from "@google/genai";

export async function POST(request: Request) {
  try {
    const prompt = `
Generate exactly 3 unique, short, friendly, and engaging mystery messages
that users can share anonymously on social media.

Keep them fun, positive, creative, and conversation-starting.
Avoid offensive, romantic, or inappropriate content.

Return ONLY the 3 messages as a single string,
separated by ||.

Do not include numbering, headings, explanations, or quotation marks.
`;


    const response = await gemini.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });

    return NextResponse.json({
      success: true,
      reply: response.output_text,
    });

  } catch (error) {
    console.error("Gemini API Error:", error);

    if(error instanceof ApiError ){
      const {status,message,name}=error;
    return NextResponse.json(
      {
        name,status,message
        },
        { status}
      );
    }
    else
      console.log("An unexpectedError: ",error);
  }
}