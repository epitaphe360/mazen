import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { AlertTriangle, BadgeCheck, Coins, BarChart2 } from "lucide-react";
import { useTranslation } from "../lib/i18n";

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#65a30d", "#dc2626", "#9333ea"];

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
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex p-2 rounded-lg bg-blue-50 text-blue-700">
          <Icon className="w-5 h-5" />
        </span>
        {change !== undefined && (
          <span className={`text-sm font-semibold ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500">{t('dashboard.loading')}</p>
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
            value={formatCurrency(stats?.total_revenue ?? 0)}
            change={stats?.revenue_change_percent}
            icon={Coins}
          />
          <StatCard
            label={t('dashboard.stats.transactions')}
            value={(stats?.total_transactions ?? 0).toLocaleString('en-US')}
            change={stats?.transactions_change_percent}
            icon={BarChart2}
          />
          <StatCard
            label={t('dashboard.stats.compliance')}
            value={`${stats?.compliance_rate ?? 0}%`}
            icon={BadgeCheck}
          />
          <StatCard
            label={t('dashboard.stats.alerts')}
            value={String(stats?.active_alerts ?? 0)}
            icon={AlertTriangle}
          />
        </div>

        {/* Graphiques */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Évolution revenus */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution des recettes sur 30 jours</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueChart ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} name="Revenus" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition sectorielle */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition sectorielle des recettes</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sectorChart ?? []}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {(sectorChart ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparaison secteurs */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recettes par secteur</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sectorChart ?? []} margin={{ top: 5, right: 20, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#2563eb" name="Revenus" radius={[4, 4, 0, 0]}>
                {(sectorChart ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alertes et transactions récentes */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Alertes */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Alertes récentes</h2>
              <span className="badge badge-red">{alerts?.total ?? 0} actives</span>
            </div>
            {(alerts?.data ?? []).length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">Aucune alerte active</p>
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
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(alert.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transactions récentes */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Transactions récentes</h2>
            {(transactions?.data ?? []).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Aucune transaction</p>
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
                      <p className="text-xs text-gray-600">{new Date(tx.date).toLocaleDateString("fr-FR")}</p>
                      <p className="mt-1 text-base font-bold text-gray-900">{formatCurrency(tx.transaction_amount)}</p>
                    </article>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Opérateur</th>
                        <th className="pb-2">Montant</th>
                        <th className="pb-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(transactions?.data ?? []).map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="py-2 text-gray-500">{new Date(tx.date).toLocaleDateString("fr-FR")}</td>
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
