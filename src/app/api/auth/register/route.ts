import { NextRequest, NextResponse } from "next/server";
import { PrismaAdminRepository } from "@/infrastructure/repositories/PrismaAdminRepository";
import { PasswordService } from "@/infrastructure/auth/PasswordService";
import { CreateAdminUseCase } from "@/application/useCases/auth/createAdmin";
import { passwordSchema } from "@/infrastructure/zod/passwordSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードは必須です" },
        { status: 400 },
      );
    }

    const result = passwordSchema.safeParse({ email, password });
    const message = result.error?.issues.map((i) => i.message);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation Error", message },
        { status: 400 },
      );
    }

    // ユースケース実行
    const adminRepository = new PrismaAdminRepository();
    const passwordService = new PasswordService();
    const createAdminUseCase = new CreateAdminUseCase(
      adminRepository,
      passwordService,
    );

    const admin = await createAdminUseCase.execute(email, password);

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email.value,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "管理者の作成に失敗しました";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
