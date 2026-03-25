import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";

const REQUEST_TYPE_LABELS: Record<string, string> = {
  demo: "Démonstration",
  information: "Information",
  partnership: "Partenariat",
};

export default function AdminMessages() {
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading, refetch } = trpc.contact.getMessages.useQuery({ page, limit: 20, unread: unreadOnly || undefined });
  const markReadMut = trpc.contact.markAsRead.useMutation({ onSuccess: () => refetch() });

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Messages de contact
            </h1>
            <p className="text-gray-500">Demandes reçues via le formulaire de contact</p>
          </div>
          {/* Toggle non lus */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={e => { setUnreadOnly(e.target.checked); setPage(1); }}
              className="w-4 h-4 rounded accent-govblue"
            />
            <span className="text-sm font-medium text-gray-700">Non lus uniquement</span>
          </label>
        </div>

        {/* Liste messages */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (data?.data ?? []).length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-5xl mb-3">📭</p>
              <p className="text-gray-500">Aucun message{unreadOnly ? " non lu" : ""}</p>
            </div>
          ) : (
            (data?.data ?? []).map(msg => {
              const isExpanded = expanded === msg.id;
              return (
                <div
                  key={msg.id}
                  className={`card border-l-4 transition-all ${msg.is_read ? "border-l-gray-200 opacity-75" : "border-l-govblue"}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-govblue flex items-center justify-center text-white font-bold flex-shrink-0">
                      {(msg.name as string).charAt(0).toUpperCase()}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{msg.name as string}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-sm text-gray-500">{msg.email as string}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-sm text-gray-500">{msg.country as string}</span>
                        {!msg.is_read && (
                          <span className="badge bg-govblue text-white text-xs">Nouveau</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="badge badge-blue text-xs">
                          {msg.sector_of_interest as string}
                        </span>
                        <span className="badge bg-purple-100 text-purple-800 border border-purple-200 text-xs">
                          {REQUEST_TYPE_LABELS[msg.request_type as string] ?? msg.request_type as string}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.created_at as string).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Message preview / complet */}
                      <p className={`text-sm text-gray-700 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}>
                        {msg.message as string}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => setExpanded(isExpanded ? null : msg.id as number)}
                          className="text-xs text-govblue hover:underline"
                        >
                          {isExpanded ? "Réduire" : "Lire le message complet"}
                        </button>
                        {!msg.is_read && (
                          <button
                            onClick={() => markReadMut.mutate({ id: msg.id as number })}
                            disabled={markReadMut.isPending}
                            className="text-xs text-green-700 hover:underline disabled:opacity-50"
                          >
                            ✓ Marquer comme lu
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.email as string}?subject=Re: ${REQUEST_TYPE_LABELS[msg.request_type as string] ?? "Votre demande"} — Mazen GovTech`}
                          className="text-xs text-gray-500 hover:text-govblue"
                        >
                          ✉️ Répondre
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {(data?.total ?? 0) > 20 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {(page - 1) * 20 + 1}–{Math.min(page * 20, data?.total ?? 0)} sur {data?.total}
            </span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                Précédent
              </button>
              <button disabled={page * 20 >= (data?.total ?? 0)} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
