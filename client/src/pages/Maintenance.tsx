import React, { useEffect, useState } from "react";

export default function Maintenance() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--navy-950))] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[rgb(var(--navy-700))/15] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[400px] rounded-full bg-[rgb(var(--gold-300))/5] blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-4">
          <img
            src="/mazen-logo.jpg?v=20260413"
            alt="Mazen GovTech Group"
            className="h-14 w-auto object-contain rounded-xl ring-1 ring-white/10"
          />
          <div className="text-left">
            <div className="text-lg font-black text-white leading-tight tracking-tight">
              Mazen GovTech{" "}
              <span className="text-[rgb(var(--navy-500))]">Group</span>
            </div>
            <div className="text-xs text-white/40 font-medium tracking-widest uppercase">
              Sovereign Strategic Infrastructure
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--gold-300))/20] bg-[rgb(var(--gold-300))/8] px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-amber-300 uppercase">
            Maintenance en cours
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
          Mise à jour du{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
            contenu
          </span>{" "}
          en cours
        </h1>

        {/* Body */}
        <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-4">
          Notre équipe procède actuellement à une mise à jour de nos contenus
          et de notre plateforme afin de vous offrir une expérience encore plus
          performante.
        </p>
        <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-12">
          Nous vous remercions de votre patience et serons de retour très
          prochainement.
        </p>

        {/* Animated loader */}
        <div className="flex items-center gap-3 text-white/30 text-sm tracking-widest uppercase">
          <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-amber-400 animate-spin" />
          <span>Retour imminent{dots}</span>
        </div>

        {/* Divider */}
        <div className="mt-16 w-px h-12 bg-gradient-to-b from-white/10 to-transparent mx-auto" />

        {/* Footer */}
        <p className="mt-6 text-xs text-white/20 tracking-wide">
          © {new Date().getFullYear()} Mazen GovTech Group — Toute exploitation ou reproduction interdite
        </p>
      </div>
    </div>
  );
}
