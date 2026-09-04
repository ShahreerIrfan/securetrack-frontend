"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import type { UserRole } from "@/store/authStore";

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "analyst", label: "Analyst" },
  { value: "developer", label: "Developer" },
  { value: "admin", label: "Admin" },
];

const initial = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "user" as UserRole,
};

export function CreateUserModal({ isOpen, onClose, onCreated }: CreateUserModalProps) {
  const toast = useToast();
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setValues(initial);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/auth/users/", values);
      toast.success(`User "${values.first_name} ${values.last_name}" created`);
      onCreated();
      handleClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new-first-name" className="mb-1.5 block text-sm text-copy">
              First Name
            </label>
            <Input
              id="new-first-name"
              required
              value={values.first_name}
              onChange={(e) => setValues((v) => ({ ...v, first_name: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="new-last-name" className="mb-1.5 block text-sm text-copy">
              Last Name
            </label>
            <Input
              id="new-last-name"
              required
              value={values.last_name}
              onChange={(e) => setValues((v) => ({ ...v, last_name: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label htmlFor="new-email" className="mb-1.5 block text-sm text-copy">
            Email
          </label>
          <Input
            id="new-email"
            type="email"
            required
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm text-copy">
            Password
          </label>
          <Input
            id="new-password"
            type="password"
            required
            minLength={8}
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        </div>
        <div>
          <label htmlFor="new-role" className="mb-1.5 block text-sm text-copy">
            Role
          </label>
          <Select
            id="new-role"
            value={values.role}
            onChange={(e) => setValues((v) => ({ ...v, role: e.target.value as UserRole }))}
          >
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating..." : "Create User"}
        </Button>
      </form>
    </Modal>
  );
}
