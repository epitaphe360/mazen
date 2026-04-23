import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { AlertTriangle, BadgeCheck, Coins, BarChart2 } from "lucide-react";
import { useTranslation } from "../lib/i18n";
import { NumberTicker, SpotlightCard, SkeletonCard, SkeletonChart, SkeletonRow } from "../design-system";

/** Brand-aligned chart palette (no off-brand colours) */
const COLORS = ["#173068", "#bd8632", "#2f599f", "#dcbc6c", "#85a3d3", "#7a5024", "#1f4084", "#cda046", "#5079bb"];

const SEVERITY_LABELS: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const COMPLIANCE_LABELS: Record<string, string> = {
  compliant: "Compliant",
  anomaly: "Anomaly",
  pending: "Pending",
};

function StatCard({
  label,
  value,
  numericValue,
  prefix,
  suffix,
  decimals = 0,
  change,
  icon: Icon,
  tone = "navy",
}: {
  label: string;
  value?: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "navy" | "gold" | "success" | "danger";
}) {
  const toneStyles: Record<string, string> = {
    navy:    "bg-navy-50 text-navy-700 ring-1 ring-navy-100",
    gold:    "bg-gold-50 text-gold-700 ring-1 ring-gold-100",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    danger:  "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
  };
  return (
    <SpotlightCard className="surface-interactive group">
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex p-2.5 rounded-xl ${toneStyles[tone]}`}>
          <Icon className="w-5 h-5" />
        </span>
        {change !== undefined && (
          <span className={`text-xs font-bold tabular-nums ${change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {change >= 0 ? "▲ +" : "▼ "}{change}%
          </span>
        )}
      </div>
      <p className="text-3xl font-display font-bold text-navy-900 mb-1 tracking-tight">
        {numericValue !== undefined ? (
          <NumberTicker value={numericValue} prefix={prefix} suffix={suffix} decimals={decimals} />
        ) : (
          value
        )}
      </p>
      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
    </SpotlightCard>
  );
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", notation: "compact" }).format(n);
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: revenueChart } = trpc.dashboard.revenueChart.useQuery();
  const { data: sectorChart } = trpc.dashboard.sectorChart.useQuery();
  const { data: alerts } = trpc.alerts.list.useQuery({ resolved: false, limit: 5 });
  const { data: transactions } = trpc.transactions.list.useQuery({ limit: 5 });

  if (statsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="skeleton h-8 w-48" />
              <div className="skeleton h-4 w-72" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonChart height={320} />
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="surface">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
            <div className="surface">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            <p className="text-gray-600">{t('dashboard.subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {[
              { label: t('dashboard.meta.scope'), value: "National" },
              { label: t('dashboard.meta.updated'), value: "Real-time" },
              { label: t('dashboard.meta.view'), value: "Consolidated" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label={t('dashboard.stats.revenue')}
            numericValue={Math.round((stats?.total_revenue ?? 0) / 1_000_000)}
            prefix="€"
            suffix="M"
            change={stats?.revenue_change_percent}
            icon={Coins}
            tone="gold"
          />
          <StatCard
            label={t('dashboard.stats.transactions')}
            numericValue={stats?.total_transactions ?? 0}
            change={stats?.transactions_change_percent}
            icon={BarChart2}
            tone="navy"
          />
          <StatCard
            label={t('dashboard.stats.compliance')}
            numericValue={stats?.compliance_rate ?? 0}
            suffix="%"
            icon={BadgeCheck}
            tone="success"
          />
          <StatCard
            label={t('dashboard.stats.alerts')}
            numericValue={stats?.active_alerts ?? 0}
            icon={AlertTriangle}
            tone="danger"
          />
        </div>

        {/* Graphiques */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue trend */}
          <SpotlightCard className="surface">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-display font-bold text-navy-900 tracking-tight">Revenue — last 30 days</h2>
              <span className="badge-info">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueChart ?? []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#bd8632" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#bd8632" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7a8aa6" }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 11, fill: "#7a8aa6" }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ borderRadius: 12, border: "1px solid #dde6f4", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#bd8632" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </SpotlightCard>

          {/* Sector distribution */}
          <SpotlightCard className="surface">
            <h2 className="text-base font-display font-bold text-navy-900 mb-4 tracking-tight">Sector revenue distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sectorChart ?? []}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={88}
                  innerRadius={48}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {(sectorChart ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ borderRadius: 12, border: "1px solid #dde6f4", background: "rgba(255,255,255,0.96)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </SpotlightCard>
        </div>

        {/* Revenue by sector */}
        <SpotlightCard className="surface">
          <h2 className="text-base font-display font-bold text-navy-900 mb-4 tracking-tight">Revenue by sector</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorChart ?? []} margin={{ top: 5, right: 20, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#7a8aa6" }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: "#7a8aa6" }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ borderRadius: 12, border: "1px solid #dde6f4", background: "rgba(255,255,255,0.96)" }}
              />
              <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
                {(sectorChart ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SpotlightCard>

        {/* Recent alerts and transactions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent alerts</h2>
              <span className="badge badge-red">{alerts?.total ?? 0} active</span>
            </div>
            {(alerts?.data ?? []).length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No active alerts</p>
            ) : (
              <div className="space-y-3">
                {(alerts?.data ?? []).map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`badge flex-shrink-0 ${
                      alert.severity === "critical" ? "badge-red" :
                      alert.severity === "high" ? "badge-red" :
                      alert.severity === "medium" ? "badge-yellow" : "badge-blue"
                    }`}>
                      {SEVERITY_LABELS[alert.severity] ?? alert.severity}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(alert.created_at).toLocaleDateString("en-US")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent transactions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent transactions</h2>
            {(transactions?.data ?? []).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No transactions</p>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {(transactions?.data ?? []).map(tx => (
                    <article key={tx.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">{tx.operator_name}</p>
                        <span className={`badge ${
                          tx.compliance_status === "compliant" ? "badge-green" :
                          tx.compliance_status === "anomaly" ? "badge-red" : "badge-yellow"
                        }`}>
                          {COMPLIANCE_LABELS[tx.compliance_status] ?? tx.compliance_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{new Date(tx.date).toLocaleDateString("en-US")}</p>
                      <p className="mt-1 text-base font-bold text-gray-900">{formatCurrency(tx.transaction_amount)}</p>
                    </article>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Operator</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(transactions?.data ?? []).map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="py-2 text-gray-500">{new Date(tx.date).toLocaleDateString("en-US")}</td>
                          <td className="py-2 font-medium text-gray-900">{tx.operator_name}</td>
                          <td className="py-2">{formatCurrency(tx.transaction_amount)}</td>
                          <td className="py-2">
                            <span className={`badge ${
                              tx.compliance_status === "compliant" ? "badge-green" :
                              tx.compliance_status === "anomaly" ? "badge-red" : "badge-yellow"
                            }`}>
                              {COMPLIANCE_LABELS[tx.compliance_status] ?? tx.compliance_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
