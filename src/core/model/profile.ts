export type Role = "SUPERADMIN" | "ADMIN" | "CUSTOMER";
export enum ROLE {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}
export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  code?: string;
  role?: Role;
}
