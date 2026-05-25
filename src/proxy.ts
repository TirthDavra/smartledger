import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET = process.env.AUTH_SECRET

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip next internals and API auth
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const protectedPaths = ["/dashboard", "/expenses", "/invoices"];
  const authPages = ["/login", "/register"];

  const token = await getToken({ req, secret: AUTH_SECRET });

  

  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const isAuthPage = authPages.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isAuthPage && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/invoices/:path*",
    "/login",
    "/register",
  ],
};