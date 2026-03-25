import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify("https://iscmnnbvctavtjgnplvh.supabase.co"),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzY21ubmJ2Y3RhdnRqZ25wbHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjQzMTcsImV4cCI6MjA5MDAwMDMxN30.GDVjxgmJFpA47ylOeiUbMyeuabGLrK4B3SHZGFlN2v0"),
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "shared"),
      "@client": path.resolve(__dirname, "client/src"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
