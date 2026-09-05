import { api } from "./api";

/** Attachments are only ever served through this authenticated endpoint
 * (never a direct /media/ URL), so downloading means fetching the bytes
 * with the same axios instance that attaches the auth header, then
 * handing the browser a blob to save - a plain <a href> can't carry the
 * Authorization header a click-through request would need. */
export async function downloadReportAttachment(reportId: number, filename: string) {
  const res = await api.get(`/reports/${reportId}/attachment/`, { responseType: "blob" });
  const url = URL.createObjectURL(res.data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
