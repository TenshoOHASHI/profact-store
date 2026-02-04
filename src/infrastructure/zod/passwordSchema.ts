import z from "zod";

export const passwordSchema = z
  .string({
    error: "パスワードは必須です",
  })
  .min(8, "パスワードは8文字以上である必要があります")
  .regex(/[A-Z]/, "パスワードには大文字（A-Z）を含めてください")
  .regex(/[a-z]/, "パスワードには小文字（a-z）を含めてください")
  .regex(/[0-9]/, "パスワードには数字（0-9）を含めてください");

export const emailSchema = z.email("有効なメールアドレスを指定してください");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type PasswordInput = z.infer<typeof passwordSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
