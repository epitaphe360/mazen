import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";

export const transactionsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().min(1).max(100).default(20),
        sectorId: z.number().optional(),
        status: z.enum(["compliant", "non_compliant", "anomaly"]).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, sectorId, status, from, to } = input;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from("transactions")
        .select("*, sectors(name)", { count: "exact" })
        .order("date", { ascending: false })
        .range(offset, offset + limit - 1);

      if (sectorId) query = query.eq("sector_id", sectorId);
      if (status) query = query.eq("compliance_status", status);
      if (from) query = query.gte("date", from);
      if (to) query = query.lte("date", to);

      const { data, count, error } = await query;
      if (error) throw new Error(error.message);

      return {
        data: data ?? [],
        total: count ?? 0,
        page,
        totalPages: Math.ceil((count ?? 0) / limit),
      };
    }),
});
