import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#65a30d", "#dc2626", "#9333ea"];

function StatCard({ label, value, change, icon }: { label: string; value: string; change?: number; icon: string }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
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
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", notation: "compact" }).format(n);
}

export default function Dashboard() {
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
            <p className="text-gray-500">Chargement du dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Vue d'ensemble des transactions et revenus en temps réel</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Revenus mobilisés"
            value={formatCurrency(stats?.total_revenue ?? 0)}
            change={stats?.revenue_change_percent}
            icon="💰"
          />
          <StatCard
            label="Transactions"
            value={(stats?.total_transactions ?? 0).toLocaleString("fr-FR")}
            change={stats?.transactions_change_percent}
            icon="📊"
          />
          <StatCard
            label="Taux de conformité"
            value={`${stats?.compliance_rate ?? 0}%`}
            icon="✅"
          />
          <StatCard
            label="Alertes actives"
            value={String(stats?.active_alerts ?? 0)}
            icon="⚠️"
          />
        </div>

        {/* Graphiques */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Évolution revenus */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution des revenus (30j)</h2>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition sectorielle</h2>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenus par secteur</h2>
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
              <p className="text-gray-400 text-sm text-center py-6">Aucune alerte active ✅</p>
            ) : (
              <div className="space-y-3">
                {(alerts?.data ?? []).map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`badge flex-shrink-0 ${
                      alert.severity === "critical" ? "badge-red" :
                      alert.severity === "high" ? "badge-red" :
                      alert.severity === "medium" ? "badge-yellow" : "badge-blue"
                    }`}>
                      {alert.severity}
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
              <div className="overflow-x-auto">
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
                            {tx.compliance_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
