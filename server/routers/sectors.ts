import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";

export const sectorsRouter = router({
  // Liste publique des secteurs
  list: publicProcedure.query(async () => {
    const { data, error } = await supabaseAdmin
      .from("sectors")
      .select("*")
      .order("name");

    if (error) throw new Error(error.message);
    return data ?? [];
  }),

  // Détail d'un secteur
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from("sectors")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Créer un secteur (admin)
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string(),
        icon: z.string().default("🏛️"),
        is_active: z.boolean().default(true),
        alert_threshold_transactions: z.number().default(1000),
        alert_threshold_revenue: z.number().default(100000),
        alert_threshold_compliance: z.number().default(80),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from("sectors")
        .insert(input)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Mettre à jour un secteur (admin)
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        is_active: z.boolean().optional(),
        alert_threshold_transactions: z.number().optional(),
        alert_threshold_revenue: z.number().optional(),
        alert_threshold_compliance: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const { data, error } = await supabaseAdmin
        .from("sectors")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Supprimer un secteur (admin)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from("sectors")
        .delete()
        .eq("id", input.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Activer/Désactiver le monitoring
  toggleActive: adminProcedure
    .input(z.object({ id: z.number(), is_active: z.boolean() }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from("sectors")
        .update({ is_active: input.is_active, updated_at: new Date().toISOString() })
        .eq("id", input.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
