import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";

export const reportingRouter = router({
  // Rapport filtré par secteur, période, opérateur
  getReport: protectedProcedure
    .input(
      z.object({
        sectors: z.array(z.number()).optional(),
        operators: z.array(z.string()).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        period: z.enum(["daily", "weekly", "monthly"]).default("monthly"),
        page: z.number().default(1),
        limit: z.number().min(1).max(200).default(50),
      })
    )
    .query(async ({ input }) => {
      const { sectors, operators, from, to, page, limit } = input;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from("transactions")
        .select("*, sectors(name)", { count: "exact" })
        .order("date", { ascending: false })
        .range(offset, offset + limit - 1);

      if (sectors?.length) query = query.in("sector_id", sectors);
      if (operators?.length) query = query.in("operator_name", operators);
      if (from) query = query.gte("date", from);
      if (to) query = query.lte("date", to);

      const { data, count, error } = await query;
      if (error) throw new Error(error.message);

      // Totaux du rapport
      const total_revenue = (data ?? []).reduce((s, t) => s + Number(t.transaction_amount), 0);
      const total_transactions = (data ?? []).reduce((s, t) => s + t.transaction_count, 0);
      const total_tax = (data ?? []).reduce((s, t) => s + Number(t.tax_amount ?? 0), 0);

      return {
        data: data ?? [],
        total: count ?? 0,
        page,
        totalPages: Math.ceil((count ?? 0) / limit),
        summary: {
          total_revenue,
          total_transactions,
          total_tax,
        },
      };
    }),

  // Liste des opérateurs distincts pour les filtres
  operators: protectedProcedure.query(async () => {
    const { data } = await supabaseAdmin
      .from("transactions")
      .select("operator_name")
      .order("operator_name");

    const unique = [...new Set((data ?? []).map(t => t.operator_name))];
    return unique;
  }),
});
