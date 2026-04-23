import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import { useAuthContext } from "../hooks/useAuthContext";

export default function AdminUsers() {
  const { user: currentUser } = useAuthContext();
  const [page, setPage] = useState(1);
  const [changing, setChanging] = useState<string | null>(null);

  const { data, isLoading, refetch } = trpc.auth.listUsers.useQuery({ page, limit: 20 });
  const updateRoleMut = trpc.auth.updateRole.useMutation({
    onSuccess: () => { refetch(); setChanging(null); },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User management</h1>
          <p className="text-gray-500">Manage roles and access rights of registered users</p>
        </div>

        {/* Statistiques rapides */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-3xl font-bold text-govblue">{data.total}</p>
              <p className="text-sm text-gray-500 mt-1">Total users</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-green-600">
                {(data.data ?? []).filter(u => u.role === "admin").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Administrators</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-gray-600">
                {(data.data ?? []).filter(u => u.role === "user").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Standard users</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Users ({data?.total ?? 0})</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (data?.data ?? []).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">👥</p>
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">User</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Current role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Registered at</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(data?.data ?? []).map(u => {
                    const isSelf = u.id === currentUser?.id;
                    const isChanging = changing === u.id;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-govblue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(u.name ?? u.email ?? "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{u.name ?? "—"}</p>
                              {isSelf && <p className="text-xs text-govblue">You</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${u.role === "admin" ? "badge-blue" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                            {u.role === "admin" ? "👑 Admin" : "👤 User"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(u.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          {isSelf ? (
                            <span className="text-xs text-gray-400 italic">Your account</span>
                          ) : isChanging ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateRoleMut.mutate({ userId: u.id as string, role: u.role === "admin" ? "user" : "admin" })}
                                disabled={updateRoleMut.isPending}
                                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                                  u.role === "admin"
                                    ? "text-red-700 border-red-300 hover:bg-red-50"
                                    : "text-green-700 border-green-300 hover:bg-green-50"
                                }`}
                              >
                                {updateRoleMut.isPending ? "..." : u.role === "admin" ? "Demote to user" : "Promote to admin"}
                              </button>
                              <button onClick={() => setChanging(null)} className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-50">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setChanging(u.id as string)}
                              className="px-3 py-1 text-xs text-govblue border border-govblue/30 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Change role
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {(data?.total ?? 0) > 20 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <span className="text-sm text-gray-500">
                {(page - 1) * 20 + 1}–{Math.min(page * 20, data?.total ?? 0)} of {data?.total}
              </span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                  Previous
                </button>
                <button disabled={page * 20 >= (data?.total ?? 0)} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
