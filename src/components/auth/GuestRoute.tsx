"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import { useAuthStore } from "@/store/authStore";

/**
 * The inverse of ProtectedRoute: guards the guest-only pages (login,
 * register). The session lives in one localStorage key, so a browser
 * can only hold one identity at a time - letting a signed-in user reach
 * the login form would just silently replace whoever is already logged
 * in. Bounce them to their dashboard instead; logging out first is the
 * deliberate way to switch accounts.
 */
export function GuestRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    // Read straight from the store rather than the selector above - the
    // selector can lag a render behind on the tick hydration completes.
    if (useAuthStore.getState().user) router.replace("/dashboard");
  }, [hydrated, router]);

  if (!hydrated || user) return null;

  return <>{children}</>;
}
