import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";

export const authRouter = router({
  // Récupérer l'utilisateur connecté
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  // Déconnexion
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("sb-token");
    return { success: true };
  }),

  // Callback OAuth Supabase — échange le code contre un token
  callback: publicProcedure
    .input(z.object({ access_token: z.string(), refresh_token: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(input.access_token);

      if (error || !user) {
        throw new Error("Token invalide");
      }

      // Upsert du profil utilisateur
      const { data: existing } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!existing) {
        // Premier utilisateur = admin, sinon user
        const { count } = await supabaseAdmin
          .from("profiles")
          .select("*", { count: "exact", head: true });

        await supabaseAdmin.from("profiles").insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name ?? user.email,
          role: count === 0 ? "admin" : "user",
        });
      }

      // Stocker le token dans un cookie httpOnly
      ctx.res.cookie("sb-token", input.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 jours
      });

      return { success: true };
    }),

  // Mettre à jour le rôle d'un utilisateur (admin only)
  updateRole: adminProcedure
    .input(z.object({ userId: z.string(), role: z.enum(["admin", "user"]) }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ role: input.role })
        .eq("id", input.userId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
