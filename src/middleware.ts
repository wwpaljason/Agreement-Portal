import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  if (!process.env.AUTH_SECRET) {
    console.error("AUTH_SECRET is missing. Set it in .env and restart the dev server.");
  }
  const { pathname } = request.nextUrl;
  const devPreview = process.env.NODE_ENV !== "production" && pathname.startsWith("/dev/");
  const isPublic =
    devPreview ||
    pathname === "/login" ||
    pathname.startsWith("/p/") ||
    pathname.startsWith("/api/p/") ||
    pathname.startsWith("/api/auth");

  if (isPublic || request.auth) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)"],
};
