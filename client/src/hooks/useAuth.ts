import { useAppSelector } from "@/store/hooks";

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);

  return {
    user: auth.user,
    isAuthenticated: Boolean(auth.accessToken && auth.user),
    status: auth.status,
    initialized: auth.initialized,
  };
}
