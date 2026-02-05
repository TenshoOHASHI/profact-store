import jwt from "jsonwebtoken";

export interface JwtPayload {
  adminId: string;
  email: string;
}

export interface TokenPair {
  // for api request with authentication
  accessToken: string;
  // during whole time with login
  refreshToken: string;
}

export class JwtService {
  private readonly ACCESS_TOKEN_EXPIRY = "1h";
  private readonly REFRESH_TOKEN_EXPIRY = "7d";

  generateAccessToken(payload: JwtPayload): string {
    const secret = this.getJwtSecret();
    return jwt.sign(payload, secret, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    const secret = this.getJwtSecret();
    return jwt.sign(payload, secret, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
  }

  generateToekenPair(payload: JwtPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  verifyToken(token: string): JwtPayload {
    const secret = this.getJwtSecret();
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch {
      throw new Error("Invalid or expired token");
    }
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_TOKEN is not set");
    }
    return secret;
  }
}
