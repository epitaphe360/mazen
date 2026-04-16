import React from "react";
import { Link } from "wouter";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-9xl font-extrabold text-blue-100">404</p>
          <h1 className="text-3xl font-bold text-gray-900 -mt-4 mb-4">Page introuvable</h1>
          <p className="text-gray-500 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
          <Link href="/"><a className="btn-primary">Retour à l'accueil</a></Link>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
