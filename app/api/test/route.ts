import { config } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { cookies as c } from 'next/headers';


export async function GET(request: NextRequest) {
    const cookies = request.cookies[`a_session_${config.APPWRITE_PROJECT_ID}`];
    const ck = (await c()).getAll();
    if (cookies) {
        return NextResponse.json({
            success: true,
            data: JSON.stringify(ck)
          });
    }
    return NextResponse.json({
        success: false,
        data: "cookies not found: " +  JSON.stringify(ck),
      });
}