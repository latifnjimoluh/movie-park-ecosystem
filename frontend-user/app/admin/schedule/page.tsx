"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import { api } from "@/lib/api"

interface ScheduleItem {
  id: string
  time: string
  title_fr: string
  title_en?: string
  description_fr?: string
  description_en?: string
  is_surprise: boolean
  is_after: boolean
  is_teaser: boolean
  display_order: number
  is_active: boolean
}

const EMPTY_FORM = {
  time: "", title_fr: "", title_en: "",
  description_fr: "", description_en: "",
  is_surprise: false, is_after: false, is_teaser: false,
  display_order: "0", is_active: true,
}

export default function SchedulePage() {
  const router = useRouter()
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ScheduleItem | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) { router.push("/admin/login"); return }
    loadItems()
  }, [router])

  async function loadItems() {
    setIsLoading(true); setError(null)
    try {
      const res = await api.schedule.getAll()
      const list = res.items ?? res.data ?? res ?? []
      setItems(Array.isArray(list) ? list : [])
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreate() {
    setEditing(null); setForm({ ...EMPTY_FORM }); setShowModal(true)
  }

  function openEdit(item: ScheduleItem) {
    setEditing(item)
    setForm({
      time: item.time, title_fr: item.title_fr, title_en: item.title_en ?? "",
      description_fr: item.description_fr ?? "", description_en: item.description_en ?? "",
      is_surprise: item.is_surprise, is_after: item.is_after, is_teaser: item.is_teaser,
      display_order: String(item.display_order), is_active: item.is_active,
    })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.title_fr.trim() || !form.time.trim()) { setError("Heure et titre FR obligatoires"); return }
    setIsSaving(true); setError(null)
    try {
      const payload = { ...form, display_order: Number(form.display_order) }
      if (editing) {
        await api.schedule.update(editing.id, payload)
        setSuccess("Item mis à jour")
      } else {
        await api.schedule.create(payload)
        setSuccess("Item créé")
      }
      setShowModal(false)
      await loadItems()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsSaving(false)
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  async function handleToggleActive(item: ScheduleItem) {
    try {
      await api.schedule.update(item.id, { is_active: !item.is_active })
      await loadItems()
    } catch (e: any) { setError(e.message) }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await api.schedule.delete(deleteTarget.id)
      setSuccess("Item supprimé")
      setDeleteTarget(null)
      await loadItems()
    } catch (e: any) { setError(e.message) }
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Programme de la soirée</h1>
            <p className="text-sm text-muted-foreground">Gérez les items du programme affiché sur le site public</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <Plus size={16} /> Ajouter un item
          </button>
        </div>

        {error   && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{success}</div>}

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Ordre</th>
                <th className="text-left px-4 py-3 font-medium">Heure</th>
                <th className="text-left px-4 py-3 font-medium">Titre FR</th>
                <th className="text-left px-4 py-3 font-medium">Indicateurs</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Chargement…</td></tr>}
              {!isLoading && items.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Aucun item.</td></tr>}
              {items.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{item.display_order}</td>
                  <td className="px-4 py-3 font-mono font-semibold">{item.time}</td>
                  <td className="px-4 py-3">{item.title_fr}</td>
                  <td className="px-4 py-3 space-x-1">
                    {item.is_surprise && <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">Surprise</span>}
                    {item.is_after   && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">After</span>}
                    {item.is_teaser  && <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">Teaser</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.is_active ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {item.is_active ? "Actif" : "Masqué"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-muted"><Edit2 size={14} /></button>
                      <button onClick={() => handleToggleActive(item)} className="p-1.5 rounded hover:bg-muted">
                        {item.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded hover:bg-muted text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <h2 className="text-lg font-bold">{editing ? "Modifier l'item" : "Ajouter un item"}</h2>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Heure *", key: "time", placeholder: "ex: 18h30" },
                  { label: "Ordre d'affichage", key: "display_order" },
                  { label: "Titre FR *", key: "title_fr" },
                  { label: "Titre EN", key: "title_en" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>

              {[{ label: "Description FR", key: "description_fr" }, { label: "Description EN", key: "description_en" }].map(({ label, key }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">{label}</label>
                  <textarea
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    rows={2}
                    className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}

              <div className="flex flex-wrap gap-4">
                {[
                  { label: "Bloc Surprise", key: "is_surprise" },
                  { label: "Bloc After-Minuit", key: "is_after" },
                  { label: "Teaser", key: "is_teaser" },
                  { label: "Actif", key: "is_active" },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Annuler</button>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {isSaving ? "Sauvegarde…" : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL Delete */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-2xl w-full max-w-md p-6 space-y-4">
              <h2 className="text-lg font-bold">Supprimer l'item</h2>
              <p className="text-sm text-muted-foreground">Supprimer <strong>{deleteTarget.title_fr}</strong> ?</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Annuler</button>
                <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600">Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
