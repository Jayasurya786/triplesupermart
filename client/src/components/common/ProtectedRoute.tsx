import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/constants/roles";

export function ProtectedRoute({ roles }: { roles?: Role[]; children?: ReactNode }) {
  const { isAuthenticated, user, initialized, status } = useAuth();

  if (!initialized || status === "loading") {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/portal" replace />;
  }

  return <Outlet />;
}
