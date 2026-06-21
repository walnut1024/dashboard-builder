import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import { DashboardSnapshot, DashboardStatus, fetchDashboardSnapshot } from "./dashboardApi";

function TrendChart({ data }: { data: DashboardSnapshot["trend"] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chart.setOption({
      grid: { left: 44, right: 18, top: 36, bottom: 32 },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: data.map((item) => item.time), axisLabel: { color: "#9fb2c8" } },
      yAxis: { type: "value", axisLabel: { color: "#9fb2c8" }, splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.18)" } } },
      series: [
        { name: "Current", type: "line", smooth: true, data: data.map((item) => item.value), lineStyle: { width: 3, color: "#2dd4bf" }, symbolSize: 7 },
        { name: "Benchmark", type: "line", data: data.map((item) => item.benchmark), lineStyle: { width: 2, color: "#94a3b8", type: "dashed" }, symbol: "none" },
      ],
    });
    const resize = () => chart.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={ref} className="chart" aria-label="Trend chart" />;
}

export function DashboardApp() {
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);

  useEffect(() => {
    fetchDashboardSnapshot()
      .then((data) => {
        setSnapshot(data);
        setStatus(data.kpis.length ? "ready" : "empty");
      })
      .catch(() => setStatus("error"));
  }, []);

  const statusLabel = useMemo(() => {
    if (status === "ready" && snapshot) return `Updated ${new Date(snapshot.updatedAt).toLocaleTimeString()}`;
    return status;
  }, [snapshot, status]);

  if (status === "loading") return <main className="state">Loading dashboard...</main>;
  if (status === "error") return <main className="state state-error">Unable to load dashboard data.</main>;
  if (status === "empty" || !snapshot) return <main className="state">No dashboard data for the selected scope.</main>;

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Operations Overview</p>
          <h1>Dashboard Title</h1>
        </div>
        <div className="freshness">{statusLabel}</div>
      </header>

      <section className="kpi-grid">
        {snapshot.kpis.map((kpi) => (
          <article className="panel kpi" data-component="panel" key={kpi.label}>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <small>{kpi.unit} {kpi.delta}</small>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel main-panel" data-component="panel">
          <div className="panel-title">Core Trend</div>
          <TrendChart data={snapshot.trend} />
        </article>

        <article className="panel" data-component="panel">
          <div className="panel-title">Regional Ranking</div>
          <ol className="ranking-list">
            {snapshot.ranking.map((item) => (
              <li key={item.name} className={`rank-${item.status}`}>
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ol>
        </article>

        <article className="panel" data-component="panel">
          <div className="panel-title">Live Events</div>
          <ul className="event-list">
            {snapshot.events.map((event) => (
              <li key={`${event.time}-${event.message}`} className={`event-${event.severity}`}>
                <time>{event.time}</time>
                <span>{event.message}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
