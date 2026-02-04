import { prisma } from "../prisma/prismaClient";
import type { IAdminRepository } from "@/domain/repositories/IAdminRepository";
import { Admin } from "@/domain/entities/Admin";
import { Email } from "@/domain/valueObjects/Email";

export class PrismaAdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    const adminData = await prisma.admin.findUnique({
      where: { email },
    });
    if (!adminData) {
      return null;
    }
    // Prisma to Admin
    return new Admin({
      id: adminData.id,
      email: new Email(adminData.email),
      hashedPassword: adminData.hashedPassword,
      createdAt: adminData.createdAt,
    });
  }
  async findById(id: string): Promise<Admin | null> {
    const adminData = await prisma.admin.findUnique({
      where: { id },
    });

    if (!adminData) {
      return null;
    }
    return new Admin({
      id: adminData.id,
      email: new Email(adminData.email),
      hashedPassword: adminData.hashedPassword,
    });
  }

  async save(admin: Admin): Promise<void> {
    await prisma.admin.upsert({
      where: { id: admin.id },
      create: {
        id: admin.id,
        email: admin.email.value,
        hashedPassword: admin.hashedPassword,
      },
      update: {
        email: admin.email.value,
        hashedPassword: admin.hashedPassword,
      },
    });
  }
  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.admin.count({
      where: { email },
    });

    return count > 0;
  }
}
