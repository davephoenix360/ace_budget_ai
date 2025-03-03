// api/gmail/read/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getOAuth2Client } from "@/firebase/gmailToken";

export async function GET(request: Request) {
  try {
    console.log("request sent: ", request);
    console.log("reading messages");
    const oauth2Client = await getOAuth2Client();
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 30,
    });

    const messages = response.data.messages || [];
    const messageData = await Promise.all(
      messages.map(async (message) => {
        const messageResponse = await gmail.users.messages.get({
          userId: "me",
          id: message.id || "",
        });
        return messageResponse.data;
      })
    );

    // Only return the snippet and body of each message
    const finalData = messageData.map((message) => ({
      snippet: message.snippet,
      body: message.payload?.body?.data,
    }));

    return NextResponse.json(finalData);
  } catch (error) {
    console.error("Error reading messages:", error);
    return NextResponse.json(
      { error: "Error reading Gmail messages", details: error },
      { status: 500 }
    );
  }
}
