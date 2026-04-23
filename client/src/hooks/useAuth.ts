import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "public";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadProfile(session.user);
      }
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await loadProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(sbUser: SupabaseUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", sbUser.id)
      .single();

    setUser({
      id: sbUser.id,
      email: sbUser.email ?? "",
      name: profile?.name ?? sbUser.user_metadata?.name ?? sbUser.email ?? "",
      role: profile?.role ?? "user",
    });
  }

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

  const signInWithEmail = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUpWithEmail = (email: string, password: string, name: string) =>
    supabase.auth.signUp({ email, password, options: { data: { name } } });

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPasswordForEmail = (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

  return { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, resetPasswordForEmail };
}
