import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers.js";
import { createContext } from "./trpc.js";
import { env } from "./env.js";

const app = express();

app.use(
  cors({
    origin: env.NODE_ENV === "production" ? false : ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Démarrage local uniquement — sur Vercel la fonction est exportée sans listen
if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`🚀 Serveur Mazen GovTech démarré sur http://localhost:${env.PORT}`);
  });
}

export default app;
