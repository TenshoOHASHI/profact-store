import { NextResponse } from "next/server";
import { Token } from "@/domain/valueObjects/Token";

export async function GET() {
  try {
    // トークンを生成
    const token = Token.generate();

    // 結果を表示
    return NextResponse.json({
      success: true,
      token: token.value,
      length: token.value.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
