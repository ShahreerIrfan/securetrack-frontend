"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import { useAuthStore, type UserRole } from "@/store/authStore";

export interface ProtectedRouteProps {
  children: ReactNode;
  /** Restricts the route to specific roles beyond just being logged in
   * (e.g. admin-only pages). A logged-in user whose role isn't listed
   * is redirected to /dashboard rather than /login, since they *are*
   * authenticated - just not authorized for this particular page.
   * Without this, a role-gated page still fetches admin-only data,
   * the API correctly 403s it (no leak), but the page itself is left
   * showing a loading skeleton forever with no explanation. */
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    // Read the store directly here rather than trusting the `user`
    // selector above - useSyncExternalStore can lag one render behind
    // when the store updates outside React's own event flow (this
    // store's rehydration runs from a raw Promise chain at module load,
    // not from a React-triggered update), so `user` from the hook can
    // still read stale-null on the very render where `hydrated` first
    // flips true. Confirmed via logging: getState().user was already
    // correct while the hook's `user` briefly showed null.
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      router.replace("/dashboard");
    }
  }, [hydrated, router, allowedRoles]);

  if (!hydrated || !user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
