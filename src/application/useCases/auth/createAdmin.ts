import type { IAdminRepository } from "@/domain/repositories/IAdminRepository";
import type { PasswordService } from "@/infrastructure/auth/PasswordService";
import { Admin } from "@/domain/entities/Admin";
import { Email } from "@/domain/valueObjects/Email";

export class CreateAdminUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private passwordService: PasswordService,
  ) {}

  async execute(email: string, plainPassword: string): Promise<Admin> {
    const emailValue = new Email(email);
    const hashedPassword = await this.passwordService.hash(plainPassword);

    const admin = Admin.create(emailValue, hashedPassword);

    await this.adminRepository.save(admin);

    return admin;
  }
}
