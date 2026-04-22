import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Coins, Receipt, BarChart3, Download } from "lucide-react";
import { useTranslation } from "../lib/i18n";

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2"];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", notation: "compact" }).format(n);
}

export default function Reporting() {
  const { t } = useTranslation();
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
    const headers = ["Date", "Sector", "Operator", "Amount", "Transactions", "Tax", "Status"];
    const rows = report.data.map(t => [
      t.date, (t.sectors as { name?: string } | null)?.name ?? "", t.operator_name,
      t.transaction_amount, t.transaction_count, t.tax_amount, t.compliance_status
    ]);
    const csv = [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mazen_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('report.title')}</h1>
            <p className="text-gray-600">{t('report.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:grid grid-cols-3 gap-3">
              {[
                { label: t('report.meta.view'), value: "Consolidated" },
                { label: t('report.meta.scope'), value: selectedSectors.length ? `${selectedSectors.length} sectors` : "All sectors" },
                { label: t('report.meta.export'), value: "CSV" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm min-w-28">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <button onClick={handleExportCSV} className="btn-primary text-sm py-2">
              <Download className="w-4 h-4" aria-hidden="true" /> Exporter CSV
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="data-card">
          <h2 className="font-semibold text-gray-800 mb-4">{t('report.filters.title')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('report.filters.from')}</label>
              <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('report.filters.to')}</label>
              <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { setFrom(""); setTo(""); setSelectedSectors([]); setPage(1); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                {t('report.filters.reset')}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">{t('report.filters.sectorScope')}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: t('report.summary.revenues'), value: formatCurrency(report.summary.total_revenue), icon: Coins },
              { label: t('report.summary.transactions'), value: report.summary.total_transactions.toLocaleString('en-US'), icon: BarChart3 },
              { label: t('report.summary.taxes'), value: formatCurrency(report.summary.total_tax), icon: Receipt },
            ].map(s => (
              <div key={s.label} className="stat-card text-center">
                <span className="inline-flex p-2 rounded-lg bg-blue-50 text-blue-700 mb-2">
                  <s.icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tableau */}
        <div className="data-card">
            <h2 className="font-semibold text-gray-800 mb-4">
            {t('report.table.title')} <span className="text-gray-400 text-sm font-normal">({report?.total ?? 0} records)</span>
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {(report?.data ?? []).map(tx => (
                  <article key={tx.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{tx.operator_name}</p>
                      <span className={`badge ${
                        tx.compliance_status === "compliant" ? "badge-green" :
                        tx.compliance_status === "anomaly" ? "badge-red" : "badge-yellow"
                      }`}>
                        {tx.compliance_status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{new Date(tx.date).toLocaleDateString("en-US")}</p>
                    <p className="text-sm text-gray-700 mt-1">{(tx.sectors as { name?: string } | null)?.name ?? "-"}</p>
                    <p className="mt-1 text-base font-bold text-gray-900">{formatCurrency(tx.transaction_amount)}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('report.table.tax')}: {formatCurrency(tx.tax_amount)} · {t('report.table.volume')}: {tx.transaction_count.toLocaleString('en-US')}</p>
                  </article>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b pb-2">
                      <th className="pb-3 pr-4">{t('report.table.headers.date')}</th>
                      <th className="pb-3 pr-4">{t('report.table.headers.sector')}</th>
                      <th className="pb-3 pr-4">{t('report.table.headers.operator')}</th>
                      <th className="pb-3 pr-4">{t('report.table.headers.amount')}</th>
                      <th className="pb-3 pr-4">{t('report.table.headers.transactions')}</th>
                      <th className="pb-3 pr-4">{t('report.table.headers.tax')}</th>
                      <th className="pb-3">{t('report.table.headers.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(report?.data ?? []).map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 text-gray-500">{new Date(tx.date).toLocaleDateString("en-US")}</td>
                        <td className="py-3 pr-4 text-gray-700">{(tx.sectors as { name?: string } | null)?.name ?? "-"}</td>
                        <td className="py-3 pr-4 font-medium text-gray-900">{tx.operator_name}</td>
                        <td className="py-3 pr-4">{formatCurrency(tx.transaction_amount)}</td>
                        <td className="py-3 pr-4">{tx.transaction_count.toLocaleString('en-US')}</td>
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
                  <p className="text-sm text-gray-500">Page {page} of {report?.totalPages}</p>
                  <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                      className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                      {t('report.pagination.prev')}
                    </button>
                    <button disabled={page >= (report?.totalPages ?? 1)} onClick={() => setPage(p => p + 1)}
                      className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                      {t('report.pagination.next')}
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
