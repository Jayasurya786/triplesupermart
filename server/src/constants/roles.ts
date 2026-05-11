export const roles = ["customer", "staff", "admin"] as const;
export type Role = (typeof roles)[number];
