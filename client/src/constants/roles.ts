export type Role = "customer" | "staff" | "admin";

export const Roles = {
  Customer: "customer",
  Staff: "staff",
  Admin: "admin",
} as const;
