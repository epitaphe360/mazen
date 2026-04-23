import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import { useAuthContext } from "../hooks/useAuthContext";

const SEVERITY_CONFIG = {
  critical: { label: "Critical", badgeClass: "bg-red-100 text-red-800 border border-red-200", icon: "🚨" },
  high: { label: "High", badgeClass: "bg-orange-100 text-orange-800 border border-orange-200", icon: "⚠️" },
  medium: { label: "Medium", badgeClass: "bg-yellow-100 text-yellow-800 border border-yellow-200", icon: "⚡" },
  low: { label: "Low", badgeClass: "bg-blue-100 text-blue-800 border border-blue-200", icon: "ℹ️" },
} as const;

type SeverityKey = keyof typeof SEVERITY_CONFIG;

export default function Alerts() {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  const [filter, setFilter] = useState<{ resolved: boolean; severity?: SeverityKey }>({ resolved: false });
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = trpc.alerts.list.useQuery({
    resolved: filter.resolved,
    severity: filter.severity,
    page,
    limit: 20,
  });

  const resolveMutation = trpc.alerts.resolve.useMutation({ onSuccess: () => refetch() });

  const unresolvedCount = !filter.resolved ? (data?.total ?? 0) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Alerts & Anomalies
              {unresolvedCount !== null && unresolvedCount > 0 && (
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold">
                  {unresolvedCount}
                </span>
              )}
            </h1>
            <p className="text-gray-500">Monitoring of detected anomalies and compliance incidents</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card flex flex-wrap gap-3 items-center">
          {/* Toggle resolved / active */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            {[
              { value: false, label: "Active" },
              { value: true, label: "Resolved" },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => { setFilter(f => ({ ...f, resolved: opt.value })); setPage(1); }}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filter.resolved === opt.value ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Severity filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setFilter(f => ({ ...f, severity: undefined })); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                !filter.severity ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              All severities
            </button>
            {(Object.entries(SEVERITY_CONFIG) as [SeverityKey, typeof SEVERITY_CONFIG[SeverityKey]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => { setFilter(f => ({ ...f, severity: key })); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  filter.severity === key ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                }`}
              >
                {cfg.icon} {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary by severity (active alerts only) */}
        {!filter.resolved && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.entries(SEVERITY_CONFIG) as [SeverityKey, typeof SEVERITY_CONFIG[SeverityKey]][]).map(([key, cfg]) => {
              const count = (data?.data ?? []).filter(a => a.severity === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(f => ({ ...f, severity: f.severity === key ? undefined : key }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    filter.severity === key ? "border-gray-800 bg-gray-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="text-2xl mb-1">{cfg.icon}</div>
                  <div className="text-xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">{cfg.label}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* Alerts list */}
        <div className="card p-0 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (data?.data ?? []).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">✅</p>
              <p className="text-gray-500 font-medium">
                {filter.resolved ? "No resolved alerts" : "No active alerts — everything is clear!"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(data?.data ?? []).map((alert) => {
                const cfg = SEVERITY_CONFIG[alert.severity as SeverityKey];
                return (
                  <div key={alert.id} className={`p-5 flex items-start gap-4 ${alert.is_resolved ? "bg-gray-50 opacity-75" : "bg-white hover:bg-gray-50"} transition-colors`}>
                    {/* Severity icon */}
                    <div className="flex-shrink-0 text-2xl mt-0.5">{cfg?.icon ?? "❓"}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`badge text-xs ${cfg?.badgeClass ?? "badge-gray"}`}>
                          {cfg?.label ?? alert.severity}
                        </span>
                        {(alert.sectors as { name?: string } | null)?.name && (
                          <span className="badge badge-blue text-xs">
                            {(alert.sectors as { name: string }).name}
                          </span>
                        )}
                        {alert.is_resolved && (
                          <span className="badge badge-green text-xs">Resolved</span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium">{alert.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span>Detected on {new Date(alert.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
                        {alert.resolved_at && (
                          <span>· Resolved on {new Date(alert.resolved_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {isAdmin && !alert.is_resolved && (
                      <button
                        onClick={() => resolveMutation.mutate({ id: alert.id })}
                        disabled={resolveMutation.isPending}
                        className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                      >
                        ✓ Resolve
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {(data?.total ?? 0) > 20 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-500">
                {(page - 1) * 20 + 1}–{Math.min(page * 20, data?.total ?? 0)} of {data?.total}
              </p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                  Previous
                </button>
                <button disabled={page * 20 >= (data?.total ?? 0)} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
