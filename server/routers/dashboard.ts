import { router, protectedProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";

export const dashboardRouter = router({
  // Statistiques principales du dashboard
  stats: protectedProcedure.query(async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    // Revenus et transactions du mois courant
    const { data: current } = await supabaseAdmin
      .from("transactions")
      .select("transaction_amount, transaction_count, compliance_status")
      .gte("date", startOfMonth);

    // Revenus du mois précédent
    const { data: previous } = await supabaseAdmin
      .from("transactions")
      .select("transaction_amount, transaction_count")
      .gte("date", startOfLastMonth)
      .lt("date", endOfLastMonth);

    // Alertes actives
    const { count: activeAlerts } = await supabaseAdmin
      .from("alerts")
      .select("*", { count: "exact", head: true })
      .eq("is_resolved", false);

    const totalRevenue = (current ?? []).reduce((s, t) => s + Number(t.transaction_amount), 0);
    const totalTransactions = (current ?? []).reduce((s, t) => s + t.transaction_count, 0);
    const compliant = (current ?? []).filter(t => t.compliance_status === "compliant").length;
    const complianceRate = current?.length ? Math.round((compliant / current.length) * 100) : 0;

    const prevRevenue = (previous ?? []).reduce((s, t) => s + Number(t.transaction_amount), 0);
    const prevTransactions = (previous ?? []).reduce((s, t) => s + t.transaction_count, 0);

    const revenueChange = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0;
    const transactionsChange = prevTransactions > 0 ? Math.round(((totalTransactions - prevTransactions) / prevTransactions) * 100) : 0;

    return {
      total_revenue: totalRevenue,
      total_transactions: totalTransactions,
      compliance_rate: complianceRate,
      active_alerts: activeAlerts ?? 0,
      revenue_change_percent: revenueChange,
      transactions_change_percent: transactionsChange,
    };
  }),

  // Données pour le graphique d'évolution des revenus (30 derniers jours)
  revenueChart: protectedProcedure.query(async () => {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data } = await supabaseAdmin
      .from("transactions")
      .select("date, transaction_amount, transaction_count")
      .gte("date", since.toISOString())
      .order("date", { ascending: true });

    // Grouper par jour
    const byDay: Record<string, { revenue: number; transactions: number }> = {};
    for (const t of data ?? []) {
      const day = t.date.slice(0, 10);
      if (!byDay[day]) byDay[day] = { revenue: 0, transactions: 0 };
      byDay[day].revenue += Number(t.transaction_amount);
      byDay[day].transactions += t.transaction_count;
    }

    return Object.entries(byDay).map(([date, values]) => ({
      date,
      ...values,
    }));
  }),

  // Répartition sectorielle
  sectorChart: protectedProcedure.query(async () => {
    const { data } = await supabaseAdmin
      .from("transactions")
      .select("sector_id, transaction_amount, transaction_count, compliance_status, sectors(name)");

    const bySector: Record<string, { name: string; revenue: number; transactions: number; compliant: number; total: number }> = {};

    for (const t of data ?? []) {
      const key = String(t.sector_id);
      const sectorName = (t.sectors as { name?: string } | null)?.name ?? `Secteur ${t.sector_id}`;
      if (!bySector[key]) bySector[key] = { name: sectorName, revenue: 0, transactions: 0, compliant: 0, total: 0 };
      bySector[key].revenue += Number(t.transaction_amount);
      bySector[key].transactions += t.transaction_count;
      bySector[key].total += 1;
      if (t.compliance_status === "compliant") bySector[key].compliant += 1;
    }

    return Object.values(bySector).map(s => ({
      name: s.name,
      revenue: s.revenue,
      transactions: s.transactions,
      compliance: s.total > 0 ? Math.round((s.compliant / s.total) * 100) : 0,
    }));
  }),
});
