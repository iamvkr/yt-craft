// api/v1/waitlist

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email }: { email: string } = body;
    if (!email) {
        throw new Error("Missing params")
    }
    const object = {
      access_key: process.env.WEB3FORMS_ACCESS_KEY!,
      email,
      message: "Registered for Pro Plan",
    };
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(object),
      next: { revalidate: 3600, tags:[email] },
    });
    if (!res.ok) {
      throw new Error("Failed to send Message");
    }
    return NextResponse.json({
      success: true,
      message: "Send Success",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    });
  }
}
