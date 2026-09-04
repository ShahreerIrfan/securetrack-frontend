"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/authStore";

const noop = () => () => {};

/**
 * zustand's persist middleware rehydrates from localStorage
 * asynchronously, even though the underlying storage read is
 * synchronous - reading `user` on the very first render can see it as
 * null for an already-logged-in visitor before hydration finishes.
 *
 * Both route guards depend on this: without it, ProtectedRoute would
 * bounce a logged-in user to /login on refresh, and GuestRoute would
 * flash the login form at someone who is already signed in.
 *
 * Modelled as an external store rather than useState+useEffect because
 * that's exactly what it is - hydration completion is state owned by
 * zustand, not by React.
 *
 * On the server (SSR/prerender), zustand never attaches `.persist` at
 * all (it evaluates window.localStorage eagerly and bails when `window`
 * doesn't exist) - hence the optional chaining on every access.
 */
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist?.onFinishHydration(onStoreChange) ?? noop(),
    () => useAuthStore.persist?.hasHydrated() ?? false,
    () => false,
  );
}
