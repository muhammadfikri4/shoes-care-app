export type Role = "SUPERADMIN" | "ADMIN" | "CUSTOMER";

export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  code?: string;
  role?: Role;
}
