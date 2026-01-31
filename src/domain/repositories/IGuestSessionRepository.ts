import { GuestSession } from "../entities/GuestSession";

export interface IGuestSessionRepository {
  save(session: GuestSession): Promise<void>;
  findByToken(token: string): Promise<GuestSession | null>;
  deleteExpired(): Promise<void>;
}
