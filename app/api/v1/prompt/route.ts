import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUser } from "../../utility/getVerifiedUser";
import { aiMethod } from "./aiMethod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;
    const type = body.type;
    if (!prompt || !type) {
      throw new Error("Missing params");
    }
    if (type === "about" || type === "hero") {
      // authorization
      const result = await getVerifiedUser(req);
      if (!result || !result.data) {
        // user is unauthorized:
        throw new Error(result.message);
      }

      const { user } = result.data;
      const text = await aiMethod(prompt, type, user.$id); //this will get cached ai response
    //   console.log({ text });

      if (!text) {
        throw new Error("Failed to get Response");
      }

      return NextResponse.json({
        success: true,
        data: text,
        message: "response success",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "invalid type",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    });
  }
}
