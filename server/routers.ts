import { router } from "./_core/trpc.js";
import { authRouter } from "./routers/auth.js";
import { dashboardRouter } from "./routers/dashboard.js";
import { reportingRouter } from "./routers/reporting.js";
import { sectorsRouter } from "./routers/sectors.js";
import { transactionsRouter } from "./routers/transactions.js";
import { newsRouter } from "./routers/news.js";
import { contactRouter } from "./routers/contact.js";
import { alertsRouter } from "./routers/alerts.js";
import { settingsRouter } from "./routers/settings.js";

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter,
  reporting: reportingRouter,
  sectors: sectorsRouter,
  transactions: transactionsRouter,
  news: newsRouter,
  contact: contactRouter,
  alerts: alertsRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
