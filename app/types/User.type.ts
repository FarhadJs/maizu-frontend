export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export interface User {
  id: string;
  phoneNumber: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  nationalCode?: string;
  postalCode?: string;
  address?: string;
  isProfileCompleted: boolean;
}
