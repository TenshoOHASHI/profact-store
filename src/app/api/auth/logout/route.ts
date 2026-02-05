import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "ログアウトしました",
  });

  // Cookieを削除
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}
