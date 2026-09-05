import { api } from "./api";

/** Fetches a protected file with the auth header attached and hands the
 * browser a blob to save. A plain <a href> can't carry the Authorization
 * header these endpoints require, so every download goes through here. */
export async function downloadAuthedFile(path: string, filename: string) {
  const res = await api.get(path, { responseType: "blob" });
  const url = URL.createObjectURL(res.data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadReportAttachment(reportId: number, filename: string) {
  return downloadAuthedFile(`/reports/${reportId}/attachment/`, filename);
}

/** Exports the reports list as CSV, passing through whatever filters the
 * table is currently applying so the file matches what's on screen. */
export function exportReportsCsv(params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  const today = new Date().toISOString().slice(0, 10);
  return downloadAuthedFile(
    `/reports/export/${query ? `?${query}` : ""}`,
    `securetrack-reports-${today}.csv`,
  );
}
