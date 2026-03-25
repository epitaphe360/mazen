import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";

export const alertsRouter = router({
  // Liste des alertes non résolues
  list: protectedProcedure
    .input(
      z.object({
        resolved: z.boolean().optional(),
        severity: z.enum(["critical", "high", "medium", "low"]).optional(),
        sectorId: z.number().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      let query = supabaseAdmin
        .from("alerts")
        .select("*, sectors(name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + input.limit - 1);

      if (input.resolved !== undefined) query = query.eq("is_resolved", input.resolved);
      if (input.severity) query = query.eq("severity", input.severity);
      if (input.sectorId) query = query.eq("sector_id", input.sectorId);

      const { data, count, error } = await query;
      if (error) throw new Error(error.message);

      return { data: data ?? [], total: count ?? 0 };
    }),

  // Marquer une alerte comme résolue (admin)
  resolve: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from("alerts")
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq("id", input.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
