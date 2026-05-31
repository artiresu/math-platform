import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const origin = new URL(request.url).origin;
    
    // Fallback to local development simulation if credentials aren't configured
    if (!googleClientId || !process.env.GOOGLE_CLIENT_SECRET) {
      console.log("Google OAuth credentials not configured. Redirecting to development simulator.");
      return NextResponse.redirect(`${origin}/auth/google-sim`);
    }

    const redirectUri = `${origin}/api/auth/google/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent("openid email profile")}&` +
      `prompt=select_account`;

    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error("Google auth redirect error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Google sign-in" },
      { status: 500 }
    );
  }
}
