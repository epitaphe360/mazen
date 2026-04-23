import React, { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTRPCClient } from "./lib/trpc";
import { AuthProvider } from "./hooks/useAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  SmoothScroll,
  MagneticCursor,
  ScrollProgress,
  PageLoader,
  CommandPalette,
} from "./design-system";

// Lazy pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const About = lazy(() => import("./pages/About"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Reporting = lazy(() => import("./pages/Reporting"));
const SectorManagement = lazy(() => import("./pages/SectorManagement"));
const Alerts = lazy(() => import("./pages/Alerts"));
const AdminNews = lazy(() => import("./pages/AdminNews"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const Transactions = lazy(() => import("./pages/Transactions"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const MaritimeSurveillance = lazy(() => import("./pages/MaritimeSurveillance"));
const RevenueSupervision = lazy(() => import("./pages/RevenueSupervision"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const trpcClient = createTRPCClient();

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-navy-200 border-t-navy-700 animate-spin" />
        <span className="text-xs uppercase tracking-widest text-slate-400">Loading</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SmoothScroll>
            <PageLoader />
            <ScrollProgress />
            <MagneticCursor />
            <CommandPalette />

            <Suspense fallback={<RouteFallback />}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/auth/callback" component={AuthCallback} />
                <Route path="/about" component={About} />
                <Route path="/case-studies" component={CaseStudies} />
                <Route path="/news" component={News} />
                <Route path="/news/:slug" component={NewsDetail} />
                <Route path="/contact" component={Contact} />
                <Route path="/solutions/maritime" component={MaritimeSurveillance} />
                <Route path="/solutions/revenues" component={RevenueSupervision} />

                <Route path="/dashboard">
                  {() => (<ProtectedRoute><Dashboard /></ProtectedRoute>)}
                </Route>
                <Route path="/dashboard/reporting">
                  {() => (<ProtectedRoute><Reporting /></ProtectedRoute>)}
                </Route>
                <Route path="/dashboard/sectors">
                  {() => (<ProtectedRoute><SectorManagement /></ProtectedRoute>)}
                </Route>
                <Route path="/dashboard/alerts">
                  {() => (<ProtectedRoute><Alerts /></ProtectedRoute>)}
                </Route>
                <Route path="/dashboard/news">
                  {() => (<ProtectedRoute adminOnly><AdminNews /></ProtectedRoute>)}
                </Route>
                <Route path="/dashboard/transactions">
                  {() => (<ProtectedRoute><Transactions /></ProtectedRoute>)}
                </Route>
                <Route path="/dashboard/messages">
                  {() => (<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>)}
                </Route>
                <Route path="/dashboard/users">
                  {() => (<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>)}
                </Route>
                <Route path="/dashboard/profile">
                  {() => (<ProtectedRoute><Profile /></ProtectedRoute>)}
                </Route>

                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </SmoothScroll>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
