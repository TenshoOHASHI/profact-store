import type { JwtService } from "@/infrastructure/auth/JwtService";
import type { TokenPair } from "@/infrastructure/auth/JwtService";

export class RefreshTokenUseCase {
  constructor(private jwtService: JwtService) {}

  async execute(refreshToken: string): Promise<TokenPair> {
    const payload = this.jwtService.verifyToken(refreshToken);
    const tokens = this.jwtService.generateToekenPair(payload);

    return tokens;
  }
}
