const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = localStorage.getItem("accessToken");
  
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  return (await response.json()) as T;
}
