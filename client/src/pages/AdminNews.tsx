import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import { z } from "zod";

const CATEGORIES = [
  { value: "innovation", label: "Innovation" },
  { value: "deployment", label: "Deployment" },
  { value: "trends", label: "Trends" },
  { value: "events", label: "Events" },
  { value: "testimonials", label: "Testimonials" },
] as const;

type CategoryValue = typeof CATEGORIES[number]["value"];

function slugify(str: string) {
  return str.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

const emptyForm = {
  title: "", slug: "", content: "", category: "innovation" as CategoryValue, author: "",
  featured_image_url: "", published_at: "",
};

type NewsForm = typeof emptyForm;

export default function AdminNews() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof NewsForm, string>>>({});

  const { data, isLoading, refetch } = trpc.news.adminList.useQuery({ page, limit: 15 });

  const createMut = trpc.news.create.useMutation({ onSuccess: () => { refetch(); closeForm(); } });
  const updateMut = trpc.news.update.useMutation({ onSuccess: () => { refetch(); closeForm(); } });
  const deleteMut = trpc.news.delete.useMutation({ onSuccess: () => { refetch(); setDeleteTarget(null); } });

  const formSchema = z.object({
    title: z.string().min(5, "Minimum 5 characters"),
    slug: z.string().min(3, "Minimum 3 characters").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
    content: z.string().min(50, "Minimum 50 characters"),
    author: z.string().min(2, "Minimum 2 characters"),
  });

  function openCreate() {
    setForm(emptyForm);
    setEditId(null);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(article: NonNullable<typeof data>["data"][number]) {
    setForm({
      title: article.title as string,
      slug: article.slug as string,
      content: (article.content ?? "") as string,
      category: (article.category as CategoryValue) ?? "innovation",
      author: (article.author ?? "") as string,
      featured_image_url: (article.featured_image_url ?? "") as string,
      published_at: (article.published_at ?? "") as string,
    });
    setEditId(article.id as number);
    setErrors({});
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setForm({ ...emptyForm });
    setErrors({});
  }

  function handleTitleChange(value: string) {
    setForm(f => ({ ...f, title: value, slug: editId ? f.slug : slugify(value) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const errs: typeof errors = {};
      parsed.error.issues.forEach(issue => {
        const key = issue.path[0] as keyof NewsForm;
        errs[key] = issue.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    if (editId !== null) {
      updateMut.mutate({
        id: editId,
        title: form.title,
        content: form.content || undefined,
        category: form.category as CategoryValue,
        featured_image_url: form.featured_image_url || undefined,
        published_at: form.published_at || new Date().toISOString(),
      });
    } else {
      createMut.mutate({
        title: form.title,
        slug: form.slug,
        content: form.content,
        category: form.category as CategoryValue,
        author: form.author,
        featured_image_url: form.featured_image_url || undefined,
        published_at: form.published_at || new Date().toISOString(),
      });
    }
  }

  const isMutating = createMut.isPending || updateMut.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">News management</h1>
            <p className="text-gray-500">Create, edit and publish portal articles</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <span>+</span> New article
          </button>
        </div>

        {/* Create/edit form */}
        {showForm && (
          <div className="card border-2 border-govblue/20">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              {editId ? "Edit article" : "Create article"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    className={`input-field w-full ${errors.title ? "border-red-400" : ""}`}
                    placeholder="Article title"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                    className={`input-field w-full font-mono text-sm ${errors.slug ? "border-red-400" : ""}`}
                    placeholder="article-url"
                  />
                  {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as CategoryValue }))}
                    className="input-field w-full"
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                {/* Auteur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Author name"
                  />
                </div>
                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
                  <input
                    type="url"
                    value={form.featured_image_url}
                    onChange={e => setForm(f => ({ ...f, featured_image_url: e.target.value }))}
                    className="input-field w-full"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={10}
                  className={`input-field w-full resize-y font-mono text-sm ${errors.content ? "border-red-400" : ""}`}
                  placeholder="Article content (paragraphs separated by blank lines)"
                />
                {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
              </div>

              {/* Publication date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publication date (empty = publish now)</label>
                <input
                  type="datetime-local"
                  value={form.published_at ? form.published_at.slice(0, 16) : ""}
                  onChange={e => setForm(f => ({ ...f, published_at: e.target.value ? new Date(e.target.value).toISOString() : "" }))}
                  className="input-field w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isMutating} className="btn-primary disabled:opacity-50">
                  {isMutating ? "Saving..." : editId ? "Update" : "Create article"}
                </button>
                <button type="button" onClick={closeForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table des articles */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Articles ({data?.total ?? 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (data?.data ?? []).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">📝</p>
              <p className="text-gray-500">No articles. Create one above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Title</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Author</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                      </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(data?.data ?? []).map(article => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900 max-w-xs truncate">{article.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">/news/{article.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-blue text-xs capitalize">
                          {CATEGORIES.find(c => c.value === article.category)?.label ?? article.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{article.author ?? "—"}</td>
                      <td className="px-4 py-3">
                        {article.published_at ? (
                          <span className="badge badge-green text-xs">Published</span>
                        ) : (
                          <span className="badge bg-gray-100 text-gray-600 border border-gray-200 text-xs">Draft</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {article.published_at ? new Date(article.published_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-govblue rounded transition-colors" title="View article">
                            👁
                          </a>
                          <button onClick={() => openEdit(article)}
                            className="p-1.5 text-gray-400 hover:text-govblue rounded transition-colors" title="Edit">
                            ✏️
                          </button>
                          <button onClick={() => setDeleteTarget({ id: article.id as number, title: article.title })}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors" title="Delete">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {(data?.total ?? 0) > 15 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <span className="text-sm text-gray-500">
                {(page - 1) * 15 + 1}–{Math.min(page * 15, data?.total ?? 0)} of {data?.total}
              </span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                  Previous
                </button>
                <button disabled={page * 15 >= (data?.total ?? 0)} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-white transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmation suppression */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-5">
              <p className="text-4xl mb-3">🗑️</p>
              <h3 className="text-lg font-bold text-gray-900">Confirm deletion</h3>
              <p className="text-gray-500 mt-2 text-sm">
                The article <strong className="text-gray-700">"{deleteTarget.title}"</strong> will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => deleteMut.mutate({ id: deleteTarget.id })}
                disabled={deleteMut.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMut.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
