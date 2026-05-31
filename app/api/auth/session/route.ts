import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getAuthUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching session" },
      { status: 500 }
    );
  }
}
