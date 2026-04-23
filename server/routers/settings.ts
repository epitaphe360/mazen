import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";

/**
 * Table attendue dans Supabase :
 *
 * CREATE TABLE IF NOT EXISTS public.api_settings (
 *   key         TEXT PRIMARY KEY,
 *   label       TEXT NOT NULL,
 *   value       TEXT NOT NULL DEFAULT '',
 *   description TEXT NOT NULL DEFAULT '',
 *   category    TEXT NOT NULL DEFAULT 'general',
 *   is_secret   BOOLEAN NOT NULL DEFAULT false,
 *   updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
 * );
 * ALTER TABLE public.api_settings ENABLE ROW LEVEL SECURITY;
 * -- Seul le service_role peut lire/écrire (aucun accès anon)
 */

export const settingsRouter = router({
  /** Liste toutes les entrées de configuration API (admin only) */
  list: adminProcedure.query(async () => {
    const { data, error } = await supabaseAdmin
      .from("api_settings")
      .select("key, label, value, description, category, is_secret, updated_at")
      .order("category")
      .order("key");

    if (error) {
      // Table peut ne pas encore exister — renvoyer une liste vide
      return [] as ApiSetting[];
    }
    return (data ?? []) as ApiSetting[];
  }),

  /** Met à jour (ou crée) une clé de configuration API */
  upsert: adminProcedure
    .input(
      z.object({
        key: z.string().min(1).max(100).regex(/^[A-Z0-9_]+$/, "Uppercase, digits and underscores only"),
        label: z.string().min(1).max(120),
        value: z.string().max(1000),
        description: z.string().max(500).default(""),
        category: z.enum(["auth", "email", "telecom", "cyber", "external", "general"]),
        is_secret: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from("api_settings")
        .upsert(
          {
            key: input.key,
            label: input.label,
            value: input.value,
            description: input.description,
            category: input.category,
            is_secret: input.is_secret,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  /** Supprime une entrée de configuration */
  remove: adminProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from("api_settings")
        .delete()
        .eq("key", input.key);
      if (error) throw new Error(error.message);
      return { success: true };
    }),

  /** Teste la connectivité d'un service (ping simplifié) */
  test: adminProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Retourne le statut "configured" si la valeur est non-vide
      const { data } = await supabaseAdmin
        .from("api_settings")
        .select("value")
        .eq("key", input.key)
        .single();

      const configured = !!(data?.value && data.value.trim().length > 0);
      return { key: input.key, configured, testedAt: new Date().toISOString() };
    }),
});

export type ApiSetting = {
  key: string;
  label: string;
  value: string;
  description: string;
  category: string;
  is_secret: boolean;
  updated_at: string;
};
