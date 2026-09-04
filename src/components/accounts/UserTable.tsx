"use client";

import { useState } from "react";
import { Table, TableColumn } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatUserName } from "@/lib/format";
import { formatRelativeTime } from "@/lib/date";
import type { UserRole } from "@/store/authStore";
import type { AdminUser } from "@/types/user";

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "analyst", label: "Analyst" },
  { value: "developer", label: "Developer" },
  { value: "admin", label: "Admin" },
];

export interface UserTableProps {
  users: AdminUser[];
  /** The signed-in admin. Their own row is locked down, mirroring the
   * API's refusal to let an admin demote, deactivate or delete
   * themselves - so the UI never offers an action the server rejects. */
  currentUserId?: number;
  onRoleChange: (user: AdminUser, role: UserRole) => void;
  onToggleActive: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function UserTable({
  users,
  currentUserId,
  onRoleChange,
  onToggleActive,
  onDelete,
}: UserTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const columns: TableColumn<AdminUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">
            {formatUserName(u)}
            {u.id === currentUserId && <span className="ml-2 text-xs text-muted">(you)</span>}
          </p>
          <p className="truncate text-xs text-muted">{u.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) =>
        editingId === u.id ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              autoFocus
              value={u.role}
              onChange={(e) => {
                onRoleChange(u, e.target.value as UserRole);
                setEditingId(null);
              }}
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
      key: "is_active",
      header: "Status",
      render: (u) => (
        <Badge variant={u.is_active ? "verified" : "closed"}>
          {u.is_active ? "Active" : "Deactivated"}
        </Badge>
      ),
    },
    {
      key: "reports",
      header: "Reports",
      render: (u) => (
        <span className="whitespace-nowrap text-xs text-muted">
          {u.reports_created_count} created · {u.reports_assigned_count} assigned
        </span>
      ),
    },
    {
      key: "last_login",
      header: "Last Login",
      render: (u) => (
        <span className="whitespace-nowrap text-xs text-muted">
          {u.last_login ? formatRelativeTime(u.last_login) : "Never"}
        </span>
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
      render: (u) => {
        const isSelf = u.id === currentUserId;
        return (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              className="px-2.5 py-1 text-xs"
              disabled={isSelf}
              title={isSelf ? "You cannot change your own role" : undefined}
              onClick={() => setEditingId(u.id)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              className="px-2.5 py-1 text-xs"
              disabled={isSelf}
              title={isSelf ? "You cannot deactivate your own account" : undefined}
              onClick={() => onToggleActive(u)}
            >
              {u.is_active ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="danger"
              className="px-2.5 py-1 text-xs"
              disabled={isSelf}
              title={isSelf ? "You cannot delete your own account" : undefined}
              onClick={() => onDelete(u)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Table columns={columns} data={users} getRowKey={(u) => u.id} emptyMessage="No users found." />
  );
}
