export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export interface User {
  _id: string; // شناسه یکتا که توسط MongoDB تولید می‌شود
  phoneNumber: string; // شماره تلفن ایرانی (مثل 09123456789)
  role: UserRole; // نقش کاربر (customer, admin, super_admin)
  firstName?: string; // نام (اختیاری)
  lastName?: string; // نام خانوادگی (اختیاری)
  email?: string; // ایمیل (اختیاری)
  nationalCode?: string; // کد ملی (اختیاری)
  postalCode?: string; // کد پستی (اختیاری)
  address?: string; // آدرس کامل (اختیاری)
  isProfileCompleted: boolean; // آیا پروفایل تکمیل شده است
}
