"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Upload, User, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: string
  quote_fr: string
  quote_en?: string
  author: string
  pack_name?: string
  edition?: string
  image_url?: string
  photo_url?: string // Fallback compat
  rating: number
  is_active: boolean
  display_order: number
  updatedAt?: string
}

const EMPTY_FORM = {
  quote_fr: "", quote_en: "",
  author: "", pack_name: "", edition: "",
  rating: "5", display_order: "0", is_active: true,
}

export default function TestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) { router.push("/admin/login"); return }
    loadTestimonials()
  }, [router])

  async function loadTestimonials() {
    setIsLoading(true); setError(null)
    try {
      const res = await api.testimonials.getAll()
      const list = res.testimonials ?? res.data ?? res ?? []
      setTestimonials(Array.isArray(list) ? list : [])
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (t: Testimonial) => {
    const url = t.image_url || t.photo_url
    if (!url) return null
    if (url.startsWith("http")) return url
    const backendBase = api.baseURL.replace("/api", "")
    let finalUrl = `${backendBase}${url}`
    
    // Cache buster
    const timestamp = t.updatedAt ? new Date(t.updatedAt).getTime() : Date.now()
    return `${finalUrl}?t=${timestamp}`
  }

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setImageFile(null)
    setImagePreview(null)
    setShowModal(true)
  }

  function openEdit(t: Testimonial) {
    setEditing(t)
    setForm({
      quote_fr: t.quote_fr, quote_en: t.quote_en ?? "",
      author: t.author, pack_name: t.pack_name ?? "", edition: t.edition ?? "",
      rating: String(t.rating),
      display_order: String(t.display_order), is_active: t.is_active,
    })
    setImageFile(null)
    setImagePreview(getImageUrl(t))
    setShowModal(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSave() {
    if (!form.quote_fr.trim() || !form.author.trim()) { setError("Citation FR et auteur obligatoires"); return }
    setIsSaving(true); setError(null)
    
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const token = localStorage.getItem("admin_token")
      const url = editing 
        ? `${api.baseURL}/testimonials/${editing.id}` 
        : `${api.baseURL}/testimonials`
      
      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Erreur de sauvegarde")

      setSuccess(editing ? "Témoignage mis à jour" : "Témoignage créé")
      setShowModal(false)
      await loadTestimonials()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsSaving(false)
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  async function handleToggleActive(t: Testimonial) {
    try {
      await api.testimonials.update(t.id, { is_active: !t.is_active })
      await loadTestimonials()
    } catch (e: any) { setError(e.message) }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await api.testimonials.delete(deleteTarget.id)
      setSuccess("Témoignage supprimé")
      setDeleteTarget(null)
      await loadTestimonials()
    } catch (e: any) { setError(e.message) }
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Témoignages</h1>
            <p className="text-muted-foreground">Importez les photos et gérez les avis des participants</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> Ajouter un témoignage
          </button>
        </div>

        {/* Alerts */}
        {error   && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">{error}</div>}
        {success && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">{success}</div>}

        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest w-24">Photo</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Auteur</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Pack · Édition</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Note</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Statut</th>
                <th className="text-right px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={6} className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>}
              {!isLoading && testimonials.length === 0 && <tr><td colSpan={6} className="text-center py-20 text-muted-foreground">Aucun témoignage.</td></tr>}
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    {getImageUrl(t)
                      ? <img src={getImageUrl(t)!} alt={t.author} className="w-10 h-10 rounded-full object-cover border-2 border-border shadow-sm group-hover:scale-110 transition-transform" />
                      : <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-border"><User className="w-5 h-5 text-muted-foreground/50" /></div>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground">{t.author}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[200px] italic">"{t.quote_fr}"</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{t.pack_name} · {t.edition}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="#FACC15" className="text-[#FACC15]" />)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${t.is_active ? "bg-green-100 text-green-700 border border-green-200" : "bg-muted text-muted-foreground border border-border"}`}>
                      {t.is_active ? "Actif" : "Masqué"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(t)} title="Modifier" className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleToggleActive(t)} title={t.is_active ? "Masquer" : "Afficher"} className="p-2 rounded-lg hover:bg-muted transition-all">
                        {t.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => setDeleteTarget(t)} title="Supprimer" className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-border flex justify-between items-center bg-card">
                <h2 className="text-xl font-bold">{editing ? "Modifier le témoignage" : "Ajouter un témoignage"}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-full"><Plus className="rotate-45 w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Photo de l'auteur</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-32 rounded-full border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden relative group"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <User className="w-10 h-10 text-muted-foreground/50" />
                          <span className="text-[10px] text-muted-foreground mt-1">Photo</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>Changer</Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Nom de l'auteur *</label>
                        <input
                          type="text"
                          value={form.author}
                          onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Ex: Sarah Johnson"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Pack</label>
                        <input
                          type="text"
                          value={form.pack_name}
                          onChange={(e) => setForm((f) => ({ ...f, pack_name: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                          placeholder="Ex: Pack Couple"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Édition</label>
                        <input
                          type="text"
                          value={form.edition}
                          onChange={(e) => setForm((f) => ({ ...f, edition: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                          placeholder="Ex: Dec 2024"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Note (1-5)</label>
                        <select
                          value={form.rating}
                          onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                        >
                          {[1,2,3,4,5].map(n => <option key={n} value={String(n)}>{n} étoiles</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Ordre</label>
                        <input
                          type="number"
                          value={form.display_order}
                          onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Citation (FR) *</label>
                    <textarea
                      value={form.quote_fr}
                      onChange={(e) => setForm((f) => ({ ...f, quote_fr: e.target.value }))}
                      rows={3}
                      className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ce que l'auteur a dit en français..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Citation (EN)</label>
                    <textarea
                      value={form.quote_en}
                      onChange={(e) => setForm((f) => ({ ...f, quote_en: e.target.value }))}
                      rows={3}
                      className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="English translation..."
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="text-sm font-medium">Témoignage actif (visible sur le site)</div>
                </label>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-3 bg-card">
                <button onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Annuler</button>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving} 
                  className="px-8 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</> : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background border border-border rounded-2xl w-full max-w-md p-8 space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                <Trash2 size={32} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">Supprimer le témoignage</h2>
                <p className="text-sm text-muted-foreground">Supprimer définitivement l'avis de <strong>{deleteTarget.author}</strong> ?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Annuler</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
