import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Immediately expires cookie
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during logout" },
      { status: 500 }
    );
  }
}
