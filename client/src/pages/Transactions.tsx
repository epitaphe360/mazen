import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";

const STATUS_CONFIG = {
  compliant: { label: "Compliant", badgeClass: "badge-green" },
  non_compliant: { label: "Non compliant", badgeClass: "bg-red-100 text-red-800 border border-red-200" },
  anomaly: { label: "Anomaly", badgeClass: "bg-orange-100 text-orange-800 border border-orange-200" },
} as const;

function fmt(n: number | string) {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [sectorId, setSectorId] = useState<number | undefined>();
  const [status, setStatus] = useState<"compliant" | "non_compliant" | "anomaly" | undefined>();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading } = trpc.transactions.list.useQuery({
    page,
    limit: 20,
    sectorId,
    status,
    from: from || undefined,
    to: to || undefined,
  });

  const { data: sectorsData } = trpc.sectors.list.useQuery();

  function resetFilters() {
    setPage(1); setSectorId(undefined); setStatus(undefined); setFrom(""); setTo("");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">Complete history of transactions by sector and operator</p>
        </div>

        {/* Filtres */}
        <div className="card">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Secteur */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sector</label>
              <select
                value={sectorId ?? ""}
                onChange={e => { setSectorId(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
                className="input-field w-full text-sm"
              >
                <option value="">All sectors</option>
                {(sectorsData ?? []).map((s: { id: number; name: string }) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            {/* Statut */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Compliance status</label>
              <select
                value={status ?? ""}
                onChange={e => { setStatus(e.target.value as typeof status || undefined); setPage(1); }}
                className="input-field w-full text-sm"
              >
                <option value="">All statuses</option>
                <option value="compliant">Compliant</option>
                <option value="non_compliant">Non compliant</option>
                <option value="anomaly">Anomaly</option>
              </select>
            </div>
            {/* Date début */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }}
                className="input-field w-full text-sm" />
            </div>
            {/* Date fin */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }}
                className="input-field w-full text-sm" />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={resetFilters} className="text-sm text-govblue hover:underline">
              Reset filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              {isLoading ? "Loading..." : `${data?.total ?? 0} transaction${(data?.total ?? 0) > 1 ? "s" : ""}`}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (data?.data ?? []).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">📋</p>
              <p className="text-gray-500">No transactions for these filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Sector</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Operator</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Tax</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Transactions</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(data?.data ?? []).map(tx => {
                    const sc = STATUS_CONFIG[tx.compliance_status as keyof typeof STATUS_CONFIG];
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                          {new Date(tx.date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge badge-blue text-xs">
                            {(tx.sectors as { name?: string } | null)?.name ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{tx.operator_name}</td>
                        <td className="px-4 py-3 text-right font-mono text-gray-900">
                          {fmt(tx.transaction_amount)} FCFA
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-govblue">
                          {fmt(tx.tax_amount)} FCFA
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {Number(tx.transaction_count).toLocaleString('en-US')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${sc?.badgeClass ?? "badge-gray"}`}>
                            {sc?.label ?? tx.compliance_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {(data?.total ?? 0) > 20 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <span className="text-sm text-gray-500">
                {(page - 1) * 20 + 1}–{Math.min(page * 20, data?.total ?? 0)} of {data?.total}
              </span>
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
