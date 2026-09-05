"use client";

import { FormEvent, useEffect, useState } from "react";
import { KeyRound, Mail, UserRound } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { useAuthStore, type AuthUser } from "@/store/authStore";

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-gradient-soft text-accent">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-copy">
      {children}
    </label>
  );
}

export default function SettingsPage() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Seeds the form once the persisted user hydrates - reading straight
  // from `user` in useState would leave the inputs blank on first paint.
  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setSavingProfile(true);
    try {
      const { data } = await api.patch<AuthUser>("/auth/me/", {
        first_name: firstName,
        last_name: lastName,
        email,
      });
      setUser(data);
      toast.success("Profile updated");
    } catch (err) {
      setProfileError(extractErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await api.post("/auth/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(extractErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Settings">
        <div className="max-w-2xl space-y-6">
          <SectionCard
            icon={<UserRound size={18} />}
            title="Profile"
            description="Your name and email as they appear across SecureTrack."
          >
            <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="settings-first-name">First Name</FieldLabel>
                  <Input
                    id="settings-first-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="settings-last-name">Last Name</FieldLabel>
                  <Input
                    id="settings-last-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="settings-email">Email</FieldLabel>
                <Input
                  id="settings-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted">
                <Mail size={13} />
                This is also the address you sign in with.
              </div>

              {profileError && (
                <p role="alert" className="text-sm text-danger">
                  {profileError}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-border/60 pt-4">
                <span className="inline-flex items-center gap-2 text-xs text-muted">
                  Role
                  {user && <Badge variant={user.role}>{user.role}</Badge>}
                  <span>· only an admin can change this</span>
                </span>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard
            icon={<KeyRound size={18} />}
            title="Password"
            description="Changing your password requires your current one."
          >
            <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
              <div>
                <FieldLabel htmlFor="settings-current-password">Current Password</FieldLabel>
                <Input
                  id="settings-current-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="settings-new-password">New Password</FieldLabel>
                  <Input
                    id="settings-new-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="settings-confirm-password">Confirm New Password</FieldLabel>
                  <Input
                    id="settings-confirm-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <p className="text-xs text-muted">At least 8 characters, and not too common.</p>

              {passwordError && (
                <p role="alert" className="text-sm text-danger">
                  {passwordError}
                </p>
              )}

              <div className="flex justify-end border-t border-border/60 pt-4">
                <Button type="submit" disabled={savingPassword}>
                  {savingPassword ? "Saving..." : "Change Password"}
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
