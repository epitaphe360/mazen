import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const [, navigate] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
      else navigate("/login");
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-blue-200">Authentification en cours...</p>
      </div>
    </div>
  );
}
