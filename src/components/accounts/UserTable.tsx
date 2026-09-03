"use client";

import { useState } from "react";
import { Table, TableColumn } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatUserName } from "@/lib/format";
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
  onRoleChange: (user: AdminUser, role: UserRole) => void;
  onDelete: (user: AdminUser) => void;
}

export function UserTable({ users, onRoleChange, onDelete }: UserTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const columns: TableColumn<AdminUser>[] = [
    { key: "name", header: "Name", render: (u) => formatUserName(u) },
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
      key: "date_joined",
      header: "Joined",
      render: (u) => new Date(u.date_joined).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (u) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            className="px-2.5 py-1 text-xs"
            onClick={() => setEditingId(u.id)}
          >
            Edit
          </Button>
          <Button variant="danger" className="px-2.5 py-1 text-xs" onClick={() => onDelete(u)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table columns={columns} data={users} getRowKey={(u) => u.id} emptyMessage="No users found." />
  );
}
