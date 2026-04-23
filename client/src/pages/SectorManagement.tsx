import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTranslation } from "../lib/i18n";

export default function SectorManagement() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  const { data: sectors, refetch } = trpc.sectors.list.useQuery();
  const toggleMutation = trpc.sectors.toggleActive.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.sectors.delete.useMutation({ onSuccess: () => refetch() });
  const createMutation = trpc.sectors.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); resetForm(); } });
  const updateMutation = trpc.sectors.update.useMutation({ onSuccess: () => { refetch(); setEditing(null); } });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", icon: "🏛️",
    alert_threshold_transactions: 1000,
    alert_threshold_revenue: 100000,
    alert_threshold_compliance: 80,
  });

  function resetForm() {
    setForm({ name: "", description: "", icon: "🏛️", alert_threshold_transactions: 1000, alert_threshold_revenue: 100000, alert_threshold_compliance: 80 });
  }

  function handleEdit(sector: typeof sectors extends (infer T)[] | undefined ? T : never) {
    if (!sector) return;
    setEditing((sector as { id: number }).id);
    setForm({
      name: (sector as { name: string }).name,
      description: (sector as { description: string }).description ?? "",
      icon: (sector as { icon: string }).icon ?? "🏛️",
      alert_threshold_transactions: (sector as { alert_threshold_transactions: number }).alert_threshold_transactions,
      alert_threshold_revenue: (sector as { alert_threshold_revenue: number }).alert_threshold_revenue,
      alert_threshold_compliance: (sector as { alert_threshold_compliance: number }).alert_threshold_compliance,
    });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing, ...form });
    } else {
      createMutation.mutate(form);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('sectors.page.title')}</h1>
            <p className="text-gray-500 dark:text-navy-400">{t('sectors.page.subtitle')}</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => { setShowForm(!showForm); setEditing(null); resetForm(); }}
              className="btn-primary text-sm py-2"
            >
              {showForm ? t('sectors.form.cancel') : t('sectors.form.new')}
            </button>
          )}
        </div>

        {/* Formulaire création/édition */}
        {showForm && isAdmin && (
          <div className="card border-2 border-navy-200 dark:border-navy-600/30">
            <h2 className="font-semibold text-gray-900 mb-4">
              {editing ? t('sectors.form.editTitle') : t('sectors.form.newTitle')}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sectors.form.name')}</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sectors.form.icon')}</label>
                <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sectors.form.description')}</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sectors.form.thresholdTransactions')}</label>
                <input type="number" value={form.alert_threshold_transactions}
                  onChange={e => setForm(p => ({ ...p, alert_threshold_transactions: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sectors.form.thresholdRevenue')}</label>
                <input type="number" value={form.alert_threshold_revenue}
                  onChange={e => setForm(p => ({ ...p, alert_threshold_revenue: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sectors.form.thresholdCompliance')}</label>
                <input type="number" min={0} max={100} value={form.alert_threshold_compliance}
                  onChange={e => setForm(p => ({ ...p, alert_threshold_compliance: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="btn-primary text-sm disabled:opacity-60">
                  {editing ? t('sectors.form.update') : t('sectors.form.create')}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); resetForm(); }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  {t('sectors.form.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des secteurs — Vue mobile */}
        <div className="md:hidden space-y-4">
          {(sectors ?? []).map(sector => (
            <div key={sector.id} className="card p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sector.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{sector.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{sector.description}</p>
                  </div>
                </div>
                <span className={`badge flex-shrink-0 ${sector.is_active ? "badge-green" : "badge-gray"}`}>
                  {sector.is_active ? t('sectors.status.active') : t('sectors.status.inactive')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                <div><span className="text-gray-400 block">{t('sectors.labels.transactions')}</span>{sector.alert_threshold_transactions.toLocaleString("en-US")}</div>
                <div><span className="text-gray-400 block">{t('sectors.labels.revenue')}</span>{Number(sector.alert_threshold_revenue).toLocaleString("en-US")} €</div>
                <div><span className="text-gray-400 block">{t('sectors.labels.compliance')}</span>{sector.alert_threshold_compliance}%</div>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleMutation.mutate({ id: sector.id, is_active: !sector.is_active })}
                    className="flex-1 text-xs py-1.5 border rounded hover:bg-gray-50 transition-colors"
                  >
                    {sector.is_active ? t('sectors.action.disable') : t('sectors.action.enable')}
                  </button>
                  <button onClick={() => handleEdit(sector)}
                    className="flex-1 text-xs py-1.5 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors">
                    {t('sectors.action.edit')}
                  </button>
                  <button
                    onClick={() => { if (confirm(t('sectors.confirmDelete', { name: sector.name }))) deleteMutation.mutate({ id: sector.id }); }}
                    className="flex-1 text-xs py-1.5 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    {t('sectors.action.delete')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Liste des secteurs — Vue desktop */}
        <div className="hidden md:block card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{t('sectors.table.headers.sector')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{t('sectors.table.headers.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{t('sectors.table.headers.thresholdTransactions')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{t('sectors.table.headers.thresholdRevenue')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{t('sectors.table.headers.compliance')}</th>
                {isAdmin && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(sectors ?? []).map(sector => (
                <tr key={sector.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sector.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{sector.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{sector.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${sector.is_active ? "badge-green" : "badge-gray"}`}>
                      {sector.is_active ? t('sectors.status.active') : t('sectors.status.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{sector.alert_threshold_transactions.toLocaleString("en-US")}</td>
                  <td className="px-6 py-4 text-gray-700">{Number(sector.alert_threshold_revenue).toLocaleString("en-US")} €</td>
                  <td className="px-6 py-4 text-gray-700">{sector.alert_threshold_compliance}%</td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleMutation.mutate({ id: sector.id, is_active: !sector.is_active })}
                          className="text-xs px-2.5 py-1 border rounded hover:bg-gray-50 transition-colors"
                        >
                          {sector.is_active ? t('sectors.action.disable') : t('sectors.action.enable')}
                        </button>
                        <button onClick={() => handleEdit(sector)}
                          className="text-xs px-2.5 py-1 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors">
                          {t('sectors.action.edit')}
                        </button>
                        <button
                          onClick={() => { if (confirm(t('sectors.confirmDelete', { name: sector.name }))) deleteMutation.mutate({ id: sector.id }); }}
                          className="text-xs px-2.5 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          {t('sectors.action.delete')}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
