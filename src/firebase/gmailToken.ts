// lib/gmailToken.ts
import { firestoredb } from "./config"; // Adjust the import path as needed
import { doc, setDoc, getDoc } from "firebase/firestore";
import { google } from "googleapis";
import { Credentials } from "google-auth-library";

const TOKEN_COLLECTION = "gmail";
const TOKEN_DOCUMENT = "token";

export type gmailTokenType = {
  refresh_token: string | undefined;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string;
};

/**
 * Stores the provided Gmail token object in Firestore.
 * @param token The token object received from the Gmail OAuth callback.
 */
export async function storeGmailToken(token: Credentials): Promise<void> {
  try {
    await setDoc(doc(firestoredb, TOKEN_COLLECTION, TOKEN_DOCUMENT), token);
    console.log("Gmail token stored successfully.");
  } catch (error) {
    console.error("Error storing Gmail token:", error);
    throw error;
  }
}

/**
 * Fetches the Gmail token stored in Firestore.
 * @returns The token object.
 */
export async function fetchGmailToken(): Promise<Credentials> {
  try {
    const tokenDocRef = doc(firestoredb, TOKEN_COLLECTION, TOKEN_DOCUMENT);
    const tokenDoc = await getDoc(tokenDocRef);
    if (!tokenDoc.exists()) {
      throw new Error("No Gmail token found in Firestore.");
    }
    return tokenDoc.data() as Credentials;
  } catch (error) {
    console.error("Error fetching Gmail token:", error);
    throw error;
  }
}

/**
 * Creates and returns an OAuth2 client that is preloaded with tokens from Firestore.
 * Listens for token refresh events and updates the stored tokens automatically.
 */
export async function getOAuth2Client() {
  const tokens = await fetchGmailToken();

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  oauth2Client.setCredentials(tokens);

  // Listen for new tokens (refresh events)
  oauth2Client.on("tokens", async (newTokens) => {
    console.log("New tokens received:", newTokens);
    // Merge new tokens with existing ones. If refresh_token is not returned on refresh, preserve the stored one.
    const updatedTokens = {
      ...oauth2Client.credentials,
      ...newTokens,
      refresh_token: newTokens.refresh_token || tokens.refresh_token,
    };
    // Update Firestore with the new tokens.
    await storeGmailToken(updatedTokens);
    // Update the client's credentials
    oauth2Client.setCredentials(updatedTokens);
  });

  return oauth2Client;
}
