import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { inferAsyncReturnType } from "@trpc/server";
import type { Request, Response } from "express";
import { supabaseAdmin } from "./supabase.js";
import type { User } from "../../shared/types.js";

export async function createContext({ req, res }: { req: Request; res: Response }) {
  let user: User | null = null;

  const token = req.cookies?.["sb-token"] ?? req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    try {
      const { data: { user: sbUser }, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && sbUser) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", sbUser.id)
          .single();

        user = {
          id: sbUser.id,
          email: sbUser.email ?? "",
          name: profile?.name ?? sbUser.user_metadata?.name ?? "",
          role: profile?.role ?? "user",
          created_at: sbUser.created_at,
        };
      }
    } catch {
      // token invalide, user reste null
    }
  }

  return { req, res, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Connexion requise" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Connexion requise" });
  }
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès administrateur requis" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
