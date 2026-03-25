import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";
import { env } from "../_core/env.js";
import { TRPCError } from "@trpc/server";

// Vérification rate-limiting simple (en mémoire, suffisant pour le MVP)
const submissionCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = submissionCounts.get(ip);

  if (!record || record.resetAt < now) {
    submissionCounts.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return;
  }

  if (record.count >= 5) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Limite de soumissions atteinte (5 par jour). Réessayez demain.",
    });
  }

  record.count += 1;
}

export const contactRouter = router({
  // Soumettre le formulaire de contact (publique)
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Nom trop court"),
        email: z.string().email("Email invalide"),
        country: z.string().min(2, "Pays requis"),
        sector_of_interest: z.string().min(1, "Secteur requis"),
        request_type: z.enum(["demo", "information", "partnership"]),
        message: z.string().min(10, "Message minimum 10 caractères"),
        accept_terms: z.literal(true, { error: "Vous devez accepter les conditions" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip = ctx.req.ip ?? ctx.req.socket.remoteAddress ?? "unknown";
      checkRateLimit(ip);

      const { accept_terms: _, ...messageData } = input;

      const { error } = await supabaseAdmin.from("contact_messages").insert(messageData);
      if (error) throw new Error(error.message);

      // Notification propriétaire (log en dev, email en prod)
      if (env.NODE_ENV === "production") {
        console.log(`[CONTACT] Nouvelle demande de ${input.name} (${input.email}) - ${input.request_type}`);
      } else {
        console.log(`[DEV] Demande contact :`, messageData);
      }

      return { success: true, message: "Votre message a bien été envoyé. Nous vous répondrons sous 48h." };
    }),

  // Lister les messages (admin)
  getMessages: adminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(20), unread: z.boolean().optional() }))
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      let query = supabaseAdmin
        .from("contact_messages")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + input.limit - 1);

      if (input.unread) query = query.eq("is_read", false);

      const { data, count, error } = await query;
      if (error) throw new Error(error.message);
      return { data: data ?? [], total: count ?? 0 };
    }),

  // Marquer comme lu (admin)
  markAsRead: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", input.id);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
