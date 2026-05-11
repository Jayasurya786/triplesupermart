import { apiFetch } from "@/api/client";
import type { UserProfile } from "@/store/slices/authSlice";

export interface LoginResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
}

export async function registerMember(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  return apiFetch<{ user: UserProfile }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
