import React, { createContext, useContext } from "react";
import type { AuthUser } from "../hooks/useAuth";
import { useAuth } from "../hooks/useAuth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<unknown>;
  signInWithEmail: (email: string, password: string) => Promise<unknown>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<unknown>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
