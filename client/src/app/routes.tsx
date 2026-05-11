import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { PortalLayout } from "@/layouts/PortalLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Roles } from "@/constants/roles";
import { LandingPage } from "@/pages/LandingPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { OffersPage } from "@/pages/OffersPage";
import { LoyaltyPage } from "@/pages/LoyaltyPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PortalDashboardPage } from "@/pages/portal/PortalDashboardPage";
import { PortalProfilePage } from "@/pages/portal/PortalProfilePage";
import { PortalRewardsPage } from "@/pages/portal/PortalRewardsPage";
import { PortalCardPage } from "@/pages/portal/PortalCardPage";
import { PortalNotificationsPage } from "@/pages/portal/PortalNotificationsPage";
import { AdminCustomersPage } from "@/pages/admin/AdminCustomersPage";
import { AdminOffersPage } from "@/pages/admin/AdminOffersPage";
import { AdminRedeemPage } from "@/pages/admin/AdminRedeemPage";
import { AdminLoyaltyPage } from "@/pages/admin/AdminLoyaltyPage";
import { AdminAnalyticsPage } from "@/pages/admin/AdminAnalyticsPage";
import { AdminRedemptionsPage } from "@/pages/admin/AdminRedemptionsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="offers" element={<OffersPage />} />
        <Route path="loyalty" element={<LoyaltyPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<LoginPage />} />

        <Route
          path="portal"
          element={<ProtectedRoute roles={[Roles.Customer]} />}
        >
          <Route element={<PortalLayout />}>
            <Route index element={<PortalDashboardPage />} />
            <Route path="profile" element={<PortalProfilePage />} />
            <Route path="rewards" element={<PortalRewardsPage />} />
            <Route path="card" element={<PortalCardPage />} />
            <Route path="notifications" element={<PortalNotificationsPage />} />
          </Route>
        </Route>

        <Route
          path="admin"
          element={<ProtectedRoute roles={[Roles.Admin, Roles.Staff]} />}
        >
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="analytics" replace />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="redeem" element={<AdminRedeemPage />} />
            <Route path="loyalty" element={<AdminLoyaltyPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="redemptions" element={<AdminRedemptionsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
