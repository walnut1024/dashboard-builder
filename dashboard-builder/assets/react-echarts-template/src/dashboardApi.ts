export type DashboardStatus = "loading" | "ready" | "empty" | "error" | "stale";

export type DashboardSnapshot = {
  updatedAt: string;
  kpis: Array<{ label: string; value: string; unit?: string; delta?: string }>;
  trend: Array<{ time: string; value: number; benchmark: number }>;
  ranking: Array<{ name: string; value: number; status: "normal" | "warning" | "danger" }>;
  events: Array<{ time: string; severity: "info" | "warning" | "danger"; message: string }>;
};

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  return {
    updatedAt: new Date().toISOString(),
    kpis: [
      { label: "Service Health", value: "98.4", unit: "%", delta: "+1.2%" },
      { label: "Active Workload", value: "12,480", unit: "items", delta: "-3.1%" },
      { label: "Risk Alerts", value: "37", unit: "open", delta: "+5" },
      { label: "SLA", value: "96.8", unit: "%", delta: "+0.6%" },
    ],
    trend: [
      { time: "08:00", value: 82, benchmark: 78 },
      { time: "09:00", value: 86, benchmark: 79 },
      { time: "10:00", value: 91, benchmark: 80 },
      { time: "11:00", value: 88, benchmark: 80 },
      { time: "12:00", value: 94, benchmark: 81 },
      { time: "13:00", value: 97, benchmark: 81 },
      { time: "14:00", value: 93, benchmark: 82 },
      { time: "15:00", value: 99, benchmark: 82 },
    ],
    ranking: [
      { name: "North Region", value: 96, status: "normal" },
      { name: "Central Region", value: 91, status: "normal" },
      { name: "East Region", value: 83, status: "warning" },
      { name: "South Region", value: 78, status: "warning" },
      { name: "West Region", value: 64, status: "danger" },
    ],
    events: [
      { time: "15:42", severity: "danger", message: "Capacity threshold exceeded" },
      { time: "15:37", severity: "warning", message: "Data freshness approaching stale limit" },
      { time: "15:28", severity: "info", message: "Scheduled refresh completed" },
    ],
  };
}
