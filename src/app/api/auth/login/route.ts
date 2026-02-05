import { NextRequest, NextResponse } from "next/server";
import { PrismaAdminRepository } from "@/infrastructure/repositories/PrismaAdminRepository";
import { PasswordService } from "@/infrastructure/auth/PasswordService";
import { JwtService } from "@/infrastructure/auth/JwtService";
import { LoginAdminUseCase } from "@/application/useCases/auth/loginAdmin";
import { loginSchema } from "@/infrastructure/zod/authSchemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json(
        { error: "Validation Error", messages },
        { status: 400 },
      );
    }

    // ユースケース実行
    const adminRepository = new PrismaAdminRepository();
    const passwordService = new PasswordService();
    const jwtService = new JwtService();
    const loginAdminUseCase = new LoginAdminUseCase(
      adminRepository,
      passwordService,
      jwtService,
    );

    // api/login -> success -> get tokens -> set cookie
    // api/dashboard -> middleware -> verify access token -> dashboard
    // access token expired -> login -> create new tokens
    const tokens = await loginAdminUseCase.execute({ email, password });

    // レスポンスを作成
    const response = NextResponse.json({
      success: true,
      data: tokens,
    });

    // set ookie and auto send
    response.cookies.set("accessToken", tokens.accessToken, {
      // XSS
      httpOnly: true,
      // https scure
      secure: process.env.NODE_ENV === "production",
      // CSRF
      sameSite: "strict",
      // cookie time= access token
      maxAge: 60 * 60,
      // send cookie
      path: "/",
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "ログインに失敗しました";

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
