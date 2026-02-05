import { NextRequest, NextResponse } from "next/server";
import { JwtService } from "@/infrastructure/auth/JwtService";

export function middleware(request: NextRequest) {
  console.log("middleware...");
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/_next") ||
    request.nextUrl.pathname.startsWith("/admin/favicon.ico")
  ) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Get Token
  let token: string | undefined;

  // Authorization ヘッダー
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Cookie
  if (!token) {
    token = request.cookies.get("accessToken")?.value;
  }

  // not exits, redirect to login page
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify Token
  try {
    const jwtService = new JwtService();
    jwtService.verifyToken(token);

    // if success, go next
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
