import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";

import { useScrollTop } from "@/hooks/useScrollTop";

export function AppLayout() {
  useScrollTop();
  
  // Hide footer on portal and admin routes
 
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
