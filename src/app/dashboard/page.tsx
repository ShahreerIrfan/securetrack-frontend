"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { UserDashboard } from "./UserDashboard";
import { AnalystDashboard } from "./AnalystDashboard";
import { DeveloperDashboard } from "./DeveloperDashboard";
import { AdminDashboard } from "./AdminDashboard";

export default function DashboardPage() {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        {role === "user" && <UserDashboard />}
        {role === "analyst" && <AnalystDashboard />}
        {role === "developer" && <DeveloperDashboard />}
        {role === "admin" && <AdminDashboard />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
