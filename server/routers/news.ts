import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../_core/trpc.js";
import { supabaseAdmin } from "../_core/supabase.js";

export const newsRouter = router({
  // Liste des articles (publique)
  list: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().min(1).max(50).default(10),
        category: z
          .enum(["innovation", "deployment", "trends", "events", "testimonials"])
          .optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, category, search } = input;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from("news")
        .select("id,title,slug,category,featured_image_url,author,published_at,created_at", { count: "exact" })
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (category) query = query.eq("category", category);
      if (search) query = query.ilike("title", `%${search}%`);

      const { data, count, error } = await query;
      if (error) throw new Error(error.message);

      return { data: data ?? [], total: count ?? 0, page, totalPages: Math.ceil((count ?? 0) / limit) };
    }),

  // Détail d'un article par slug (publique)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from("news")
        .select("*")
        .eq("slug", input.slug)
        .single();

      if (error) throw new Error("Article introuvable");
      return data;
    }),

  // Créer un article (admin)
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(5),
        slug: z.string().min(3),
        content: z.string().min(10),
        category: z.enum(["innovation", "deployment", "trends", "events", "testimonials"]),
        featured_image_url: z.string().url().optional(),
        author: z.string().min(2),
        published_at: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await supabaseAdmin
        .from("news")
        .insert({ ...input, author: ctx.user.name || input.author })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Modifier un article (admin)
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(5).optional(),
        content: z.string().min(10).optional(),
        category: z.enum(["innovation", "deployment", "trends", "events", "testimonials"]).optional(),
        featured_image_url: z.string().url().optional().nullable(),
        published_at: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const { data, error } = await supabaseAdmin
        .from("news")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Supprimer un article (admin)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin.from("news").delete().eq("id", input.id);
      if (error) throw new Error(error.message);
      return { success: true };
    }),

  // Liste admin (inclut le contenu complet)
  adminList: adminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(15) }))
    .query(async ({ input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;
      const { data, count, error } = await supabaseAdmin
        .from("news")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw new Error(error.message);
      return { data: data ?? [], total: count ?? 0, page };
    }),
});
