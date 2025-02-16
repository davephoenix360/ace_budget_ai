// api/gmail/auth/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

export async function GET(request: Request) {
  const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  return NextResponse.redirect(authUrl);
}
