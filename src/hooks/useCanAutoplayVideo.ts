"use client";

import { useSyncExternalStore } from "react";

// Not in lib.dom.d.ts yet - Network Information API is Chromium-only.
interface NetworkInformation extends EventTarget {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
}

const SLOW_TYPES = new Set(["slow-2g", "2g", "3g"]);

function getConnection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

function evaluate(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  // Only Chromium exposes this - Safari/Firefox simply have no `connection`,
  // in which case we default to allowing video rather than punishing the
  // (unknown) majority of visitors for the few browsers we can measure.
  const connection = getConnection();
  if (connection?.saveData) return false;
  if (connection?.effectiveType && SLOW_TYPES.has(connection.effectiveType)) return false;

  return true;
}

function subscribe(onStoreChange: () => void) {
  const connection = getConnection();
  connection?.addEventListener?.("change", onStoreChange);
  return () => connection?.removeEventListener?.("change", onStoreChange);
}

/**
 * Whether the hero background video should load and play at all. False on
 * a data-saver connection, a measured slow connection, or when the user
 * has asked for reduced motion - in every one of those cases the poster
 * image stays put as the entire background, which is the real "fast on
 * slow internet" lever since we have no way to transcode a lighter video.
 *
 * Built on useSyncExternalStore rather than useState+useEffect because
 * this genuinely is external state (the OS/browser's view of the network
 * and the user's motion preference), not something React owns. The
 * server snapshot is always false, so the very first client paint (and
 * everything server-rendered) never references the video at all -
 * nothing requests it until this hook has actually decided it's warranted.
 */
export function useCanAutoplayVideo(): boolean {
  return useSyncExternalStore(subscribe, evaluate, () => false);
}
