import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const code = url.searchParams.get("code");
    
    // 1. MOCK/SIMULATION SIGN-IN MODE (for local development fallback)
    const isMock = url.searchParams.get("mock") === "true";
    if (isMock) {
      const email = url.searchParams.get("email") || "alex@example.com";
      const name = url.searchParams.get("name") || "Alex Google";
      const image = url.searchParams.get("image") || "";
      const providerAccountId = url.searchParams.get("id") || "mock-google-id";

      // Create or update user
      const user = await prisma.user.upsert({
        where: { email: email.toLowerCase() },
        update: { name, image },
        create: {
          email: email.toLowerCase(),
          name,
          image,
        },
      });

      // Link Account structure
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          type: "oauth",
          provider: "google",
          providerAccountId,
        },
      });

      // Sign JWT session token
      const token = signJwt({ userId: user.id });

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: "session_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 3600,
        path: "/",
        sameSite: "lax",
      });

      return NextResponse.redirect(`${origin}/`);
    }

    // 2. REAL GOOGLE OAUTH FLOW
    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!googleClientId || !googleClientSecret) {
      return NextResponse.json({ error: "Google OAuth is not configured on this server" }, { status: 500 });
    }

    const redirectUri = `${origin}/api/auth/google/callback`;

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      return NextResponse.json({ error: "Failed to exchange authorization code" }, { status: 500 });
    }

    const { access_token } = await tokenResponse.json();

    // Fetch user profile info
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch Google user profile" }, { status: 500 });
    }

    const profile = await profileResponse.json();
    const email = profile.email;
    const name = profile.name;
    const image = profile.picture;
    const googleSub = profile.sub; // Google account unique identifier

    if (!email) {
      return NextResponse.json({ error: "Google account does not expose email address" }, { status: 400 });
    }

    // Upsert User in database
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { name, image },
      create: {
        email: email.toLowerCase(),
        name,
        image,
      },
    });

    // Link Account record
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: googleSub,
        },
      },
      update: {},
      create: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: googleSub,
      },
    });

    // Sign session JWT
    const token = signJwt({ userId: user.id });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 3600,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.redirect(`${origin}/`);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during Google Sign-In" },
      { status: 500 }
    );
  }
}
