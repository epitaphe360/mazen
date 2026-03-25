import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2"];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", notation: "compact" }).format(n);
}

export default function Reporting() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const { data: sectors } = trpc.sectors.list.useQuery();
  const { data: report, isLoading } = trpc.reporting.getReport.useQuery({
    from: from || undefined,
    to: to || undefined,
    sectors: selectedSectors.length ? selectedSectors : undefined,
    page,
    limit: 50,
  });

  function toggleSector(id: number) {
    setSelectedSectors(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    setPage(1);
  }

  function handleExportCSV() {
    if (!report?.data) return;
    const headers = ["Date", "Secteur", "Opérateur", "Montant", "Transactions", "Taxe", "Statut"];
    const rows = report.data.map(t => [
      t.date, (t.sectors as { name?: string } | null)?.name ?? "", t.operator_name,
      t.transaction_amount, t.transaction_count, t.tax_amount, t.compliance_status
    ]);
    const csv = [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport_mazen_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reporting Multi-Sectoriel</h1>
            <p className="text-gray-500">Analysez les revenus filtrés par secteur, période et opérateur</p>
          </div>
          <button onClick={handleExportCSV} className="btn-primary text-sm py-2">
            ⬇ Exporter CSV
          </button>
        </div>

        {/* Filtres */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">Filtres</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date de début</label>
              <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date de fin</label>
              <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { setFrom(""); setTo(""); setSelectedSectors([]); setPage(1); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Réinitialiser
              </button>
            </div>
          </div>
          {/* Secteurs */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Secteurs</p>
            <div className="flex flex-wrap gap-2">
              {(sectors ?? []).map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleSector(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedSectors.includes(s.id)
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Résumé */}
        {report?.summary && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Revenus totaux", value: formatCurrency(report.summary.total_revenue), icon: "💰" },
              { label: "Transactions", value: report.summary.total_transactions.toLocaleString("fr-FR"), icon: "📊" },
              { label: "Taxe totale", value: formatCurrency(report.summary.total_tax), icon: "🧾" },
            ].map(s => (
              <div key={s.label} className="stat-card text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tableau */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">
            Transactions{" "}
            <span className="text-gray-400 text-sm font-normal">({report?.total ?? 0} résultats)</span>
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b pb-2">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Secteur</th>
                      <th className="pb-3 pr-4">Opérateur</th>
                      <th className="pb-3 pr-4">Montant</th>
                      <th className="pb-3 pr-4">Transactions</th>
                      <th className="pb-3 pr-4">Taxe</th>
                      <th className="pb-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(report?.data ?? []).map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 text-gray-500">{new Date(tx.date).toLocaleDateString("fr-FR")}</td>
                        <td className="py-3 pr-4 text-gray-700">{(tx.sectors as { name?: string } | null)?.name ?? "-"}</td>
                        <td className="py-3 pr-4 font-medium text-gray-900">{tx.operator_name}</td>
                        <td className="py-3 pr-4">{formatCurrency(tx.transaction_amount)}</td>
                        <td className="py-3 pr-4">{tx.transaction_count.toLocaleString("fr-FR")}</td>
                        <td className="py-3 pr-4 text-gray-600">{formatCurrency(tx.tax_amount)}</td>
                        <td className="py-3">
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

              {/* Pagination */}
              {(report?.totalPages ?? 1) > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">Page {page} sur {report?.totalPages}</p>
                  <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                      className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                      Précédent
                    </button>
                    <button disabled={page >= (report?.totalPages ?? 1)} onClick={() => setPage(p => p + 1)}
                      className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
