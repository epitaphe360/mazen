import React from "react";
import { useLocation } from "wouter";
import { useAuthContext } from "../hooks/useAuthContext";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user, loading } = useAuthContext();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (adminOnly && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-500">Vous n'avez pas les droits administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
