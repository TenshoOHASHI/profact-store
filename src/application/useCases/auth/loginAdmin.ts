import type { IAdminRepository } from "@/domain/repositories/IAdminRepository";
import type { PasswordService } from "@/infrastructure/auth/PasswordService";
import type { JwtService } from "@/infrastructure/auth/JwtService";
import type { TokenPair } from "@/infrastructure/auth/JwtService";

export class LoginAdminUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async execute(params: {
    email: string;
    password: string;
  }): Promise<TokenPair> {
    const admin = await this.adminRepository.findByEmail(params.email);

    if (!admin) {
      throw new Error("メールアドレスまたはパスワードが間違っています");
    }

    const isValid = await this.passwordService.verify(
      params.password,
      admin.hashedPassword,
    );

    if (!isValid) {
      throw new Error("メールアドレスまたはパスワードが間違っています");
    }

    const payload = {
      adminId: admin.id,
      email: admin.email.value,
    };

    return this.jwtService.generateToekenPair(payload);
  }
}
