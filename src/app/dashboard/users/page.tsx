"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { useToast } from "@/components/ui/ToastProvider";
import { CreateUserModal } from "@/components/accounts/CreateUserModal";
import { UserTable } from "@/components/accounts/UserTable";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { formatUserName } from "@/lib/format";
import { useAuthStore, type UserRole } from "@/store/authStore";
import type { AdminUser } from "@/types/user";

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "analyst", label: "Analyst" },
  { value: "developer", label: "Developer" },
  { value: "admin", label: "Admin" },
];

export default function UsersPage() {
  const toast = useToast();
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Without debouncing, every keystroke would fire its own request and
  // the slowest response could land last and overwrite the newest results.
  const debouncedSearch = useDebouncedValue(search, 300);

  const fetchUsers = () => {
    api
      .get<AdminUser[]>("/auth/users/", {
        params: {
          ...(roleFilter && { role: roleFilter }),
          ...(activeFilter && { is_active: activeFilter }),
          ...(debouncedSearch && { search: debouncedSearch }),
        },
      })
      .then((res) => setUsers(res.data));
  };

  useEffect(fetchUsers, [roleFilter, activeFilter, debouncedSearch]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of users ?? []) counts[u.role] = (counts[u.role] ?? 0) + 1;
    return counts;
  }, [users]);

  const handleRoleChange = async (targetUser: AdminUser, role: UserRole) => {
    if (role === targetUser.role) return;
    try {
      await api.patch(`/auth/users/${targetUser.id}/`, { role });
      toast.success(`${formatUserName(targetUser)}'s role updated to "${role}"`);
      fetchUsers();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleToggleActive = async (targetUser: AdminUser) => {
    const nextActive = !targetUser.is_active;
    try {
      await api.patch(`/auth/users/${targetUser.id}/`, { is_active: nextActive });
      toast.success(
        `${formatUserName(targetUser)} ${nextActive ? "reactivated" : "deactivated"}`,
      );
      fetchUsers();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDelete = async (targetUser: AdminUser) => {
    if (!confirm(`Delete user "${formatUserName(targetUser)}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/auth/users/${targetUser.id}/`);
      toast.success(`User "${formatUserName(targetUser)}" deleted`);
      fetchUsers();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout title="User Management">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roleOptions.map((r) => (
              <StatCard key={r.value} label={`${r.label}s`} value={roleCounts[r.value] ?? 0} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-56 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="pl-9"
                aria-label="Search users"
              />
            </div>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
              className="w-40"
              aria-label="Filter by role"
            >
              <option value="">All roles</option>
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
            <Select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as "" | "true" | "false")}
              className="w-40"
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Deactivated</option>
            </Select>
            <Button onClick={() => setModalOpen(true)}>Create User</Button>
          </div>

          {users ? (
            <UserTable
              users={users}
              currentUserId={currentUser?.id}
              onRoleChange={handleRoleChange}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ) : (
            <Skeleton variant="table-row" rows={5} />
          )}
        </div>

        <CreateUserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={fetchUsers}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
