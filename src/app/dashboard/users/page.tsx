"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { CreateUserModal } from "@/components/accounts/CreateUserModal";
import { UserTable } from "@/components/accounts/UserTable";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { formatUserName } from "@/lib/format";
import type { UserRole } from "@/store/authStore";
import type { AdminUser } from "@/types/user";

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "analyst", label: "Analyst" },
  { value: "developer", label: "Developer" },
  { value: "admin", label: "Admin" },
];

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = () => {
    api
      .get<AdminUser[]>("/auth/users/", { params: roleFilter ? { role: roleFilter } : undefined })
      .then((res) => setUsers(res.data));
  };

  useEffect(fetchUsers, [roleFilter]);

  const handleRoleChange = async (targetUser: AdminUser, role: UserRole) => {
    try {
      await api.patch(`/auth/users/${targetUser.id}/`, { role });
      toast.success(`${formatUserName(targetUser)}'s role updated to "${role}"`);
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
              className="sm:max-w-48"
            >
              <option value="">All roles</option>
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
            <Button onClick={() => setModalOpen(true)}>Create User</Button>
          </div>

          {users ? (
            <UserTable users={users} onRoleChange={handleRoleChange} onDelete={handleDelete} />
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
