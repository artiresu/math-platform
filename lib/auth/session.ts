import { cookies } from "next/headers";
import { verifyJwt } from "./jwt";
import { prisma } from "../prisma";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
};

/**
 * Server-side helper to retrieve the currently authenticated user.
 * Works inside Server Components, Route Handlers, and Server Actions.
 */
export async function getAuthUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    if (!token) return null;
    
    const decoded = verifyJwt(token);
    if (!decoded || !decoded.userId) return null;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}
