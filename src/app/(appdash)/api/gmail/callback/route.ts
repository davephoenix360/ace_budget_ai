// api/gmail/callback/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { storeGmailToken } from "@/firebase/gmailToken";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 }
    );
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    await storeGmailToken(tokens);

    return NextResponse.redirect("localhost:3000/tester");
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return NextResponse.json(
      { error: "Error retrieving access token" },
      { status: 500 }
    );
  }
}
