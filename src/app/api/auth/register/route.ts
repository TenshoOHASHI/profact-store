import { NextRequest, NextResponse } from "next/server";
import { PrismaAdminRepository } from "@/infrastructure/repositories/PrismaAdminRepository";
import { PasswordService } from "@/infrastructure/auth/PasswordService";
import { CreateAdminUseCase } from "@/application/useCases/auth/createAdmin";
import { registerSchema } from "@/infrastructure/zod/authSchemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    const result = registerSchema.safeParse({ email, password, name });
    const message = result.error?.issues.map((i) => i.message);
    console.log("message", message);
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

    const admin = await createAdminUseCase.execute(email, password, name);

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email.value,
        name: admin.name,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "メールアドレスが重複しています" },
        { status: 409 },
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "管理者の作成に失敗しました";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
