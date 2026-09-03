import axios from "axios";

/** Pulls a human-readable message out of a DRF error response
 * ({"detail": "..."} or {"field": ["msg"]}), falling back to the
 * generic Error/Axios message. Shared by Login and Register so both
 * surface real backend validation errors instead of "Request failed
 * with status code 400". */
export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined;
    if (data && typeof data === "object") {
      if (typeof data.detail === "string") return data.detail;
      const firstKey = Object.keys(data)[0];
      if (firstKey) {
        const value = data[firstKey];
        const text = Array.isArray(value) ? value[0] : value;
        if (typeof text === "string") return `${firstKey}: ${text}`;
      }
    }
    if (err.message) return err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong";
}
