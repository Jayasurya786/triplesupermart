import { apiFetch } from "@/api/client";

export interface CustomerRecord {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  customerId: string;
  tier: "Fresh" | "Prime" | "Emerald";
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function listCustomers() {
  return apiFetch<{ customers: CustomerRecord[] }>("/customers");
}

export async function getCustomer(customerId: string) {
  return apiFetch<{ customer: CustomerRecord }>(`/customers/${encodeURIComponent(customerId)}`);
}

export async function createCustomer(payload: {
  name: string;
  email?: string;
  phone: string;
}) {
  return apiFetch<{ customer: CustomerRecord }>("/customers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
