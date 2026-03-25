import React, { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTRPCClient } from "./lib/trpc";
import { AuthProvider } from "./hooks/useAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages lazy-loadées
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
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
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const trpcClient = createTRPCClient();

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<Spinner />}>
            <Switch>
              {/* Pages publiques */}
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/auth/callback" component={AuthCallback} />
              <Route path="/news" component={News} />
              <Route path="/news/:slug" component={NewsDetail} />
              <Route path="/contact" component={Contact} />

              {/* Dashboard — protégé */}
              <Route path="/dashboard">
                {() => (
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/reporting">
                {() => (
                  <ProtectedRoute>
                    <Reporting />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/sectors">
                {() => (
                  <ProtectedRoute>
                    <SectorManagement />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/alerts">
                {() => (
                  <ProtectedRoute>
                    <Alerts />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/news">
                {() => (
                  <ProtectedRoute adminOnly>
                    <AdminNews />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/transactions">
                {() => (
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/messages">
                {() => (
                  <ProtectedRoute adminOnly>
                    <AdminMessages />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/users">
                {() => (
                  <ProtectedRoute adminOnly>
                    <AdminUsers />
                  </ProtectedRoute>
                )}
              </Route>

              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
