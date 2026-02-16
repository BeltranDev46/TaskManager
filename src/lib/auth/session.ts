import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface SessionData {
  userId: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "task-manager-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  },
};

// Esta función ahora maneja ambos casos: API Routes y Server Components
export async function getSession(req?: NextRequest, res?: NextResponse) {
  if (req && res) {
    // Caso: Route Handler (API)
    return getIronSession<SessionData>(req, res, sessionOptions);
  }
  // Caso: Server Component
  const cookieStore = cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) return null;
  return session;
}
