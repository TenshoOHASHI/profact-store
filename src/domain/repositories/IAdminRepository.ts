import { Admin } from "../entities/Admin";

export interface IAdminREpository {
  findByEmail(email: string): Promise<Admin | null>;
  findById(id: string): Promise<Admin | null>;
  save(admin: Admin): Promise<void>;
}
