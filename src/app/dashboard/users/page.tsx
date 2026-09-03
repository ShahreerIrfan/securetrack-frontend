"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Table, TableColumn } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { CreateUserModal } from "@/components/accounts/CreateUserModal";
import { api } from "@/lib/api";
import type { UserRole } from "@/store/authStore";
import type { AdminUser } from "@/types/user";

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "analyst", label: "Analyst" },
  { value: "developer", label: "Developer" },
  { value: "admin", label: "Admin" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = () => {
    api
      .get<AdminUser[]>("/auth/users/", { params: roleFilter ? { role: roleFilter } : undefined })
      .then((res) => setUsers(res.data));
  };

  useEffect(fetchUsers, [roleFilter]);

  const handleRoleChange = async (targetUser: AdminUser, role: UserRole) => {
    await api.patch(`/auth/users/${targetUser.id}/`, { role });
    setEditingId(null);
    fetchUsers();
  };

  const handleDelete = async (targetUser: AdminUser) => {
    if (!confirm(`Delete user "${targetUser.username}"? This cannot be undone.`)) return;
    await api.delete(`/auth/users/${targetUser.id}/`);
    fetchUsers();
  };

  const columns: TableColumn<AdminUser>[] = [
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (u) =>
        editingId === u.id ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              autoFocus
              value={u.role}
              onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
              onBlur={() => setEditingId(null)}
              className="w-36 px-2.5 py-1 text-xs"
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          </div>
        ) : (
          <Badge variant={u.role}>{u.role}</Badge>
        ),
    },
    {
      key: "date_joined",
      header: "Joined",
      render: (u) => new Date(u.date_joined).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (u) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" className="px-2.5 py-1 text-xs" onClick={() => setEditingId(u.id)}>
            Edit
          </Button>
          <Button
            variant="danger"
            className="px-2.5 py-1 text-xs"
            onClick={() => handleDelete(u)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute>
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
            <Table
              columns={columns}
              data={users}
              getRowKey={(u) => u.id}
              emptyMessage="No users found."
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
