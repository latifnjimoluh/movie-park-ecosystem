"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface Film {
  id: string
  title_fr: string
  title_en?: string
  genre_fr?: string
  year?: string
  country_fr?: string
  duration?: string
  image_url?: string
  poster_url?: string // Fallback compat
  screening_time?: string
  display_order: number
  is_active: boolean
  updatedAt?: string
}

const EMPTY_FORM = {
  title_fr: "", title_en: "",
  genre_fr: "", genre_en: "",
  year: "", country_fr: "", country_en: "",
  duration: "",
  synopsis_fr: "", synopsis_en: "",
  classification_fr: "", classification_en: "",
  youtube_url: "", screening_time: "",
  display_order: "0", is_active: true,
}

export default function FilmsPage() {
  const router = useRouter()
  const [films, setFilms] = useState<Film[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingFilm, setEditingFilm] = useState<Film | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM })
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Film | null>(null)
  
  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) { router.push("/admin/login"); return }
    loadFilms()
  }, [router])

  async function loadFilms() {
    setIsLoading(true); setError(null)
    try {
      const res = await api.films.getAll()
      const list = res.films ?? res.data ?? res ?? []
      setFilms(Array.isArray(list) ? list : [])
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (film: Film) => {
    // Priorité au nouveau champ image_url (upload local)
    const url = film.image_url || film.poster_url
    if (!url) return null
    
    let finalUrl = url
    if (!url.startsWith("http")) {
      const backendBase = api.baseURL.replace("/api", "")
      finalUrl = `${backendBase}${url}`
    }

    // Ajouter un timestamp pour éviter le cache du navigateur lors d'une mise à jour
    return `${finalUrl}?t=${new Date(film.updatedAt || Date.now()).getTime()}`
  }

  function openCreate() {
    setEditingFilm(null)
    setForm({ ...EMPTY_FORM })
    setImageFile(null)
    setImagePreview(null)
    setShowModal(true)
  }

  function openEdit(film: Film) {
    setEditingFilm(film)
    setForm({
      title_fr: (film as any).title_fr ?? "",
      title_en: (film as any).title_en ?? "",
      genre_fr: (film as any).genre_fr ?? "",
      genre_en: (film as any).genre_en ?? "",
      year: (film as any).year ?? "",
      country_fr: (film as any).country_fr ?? "",
      country_en: (film as any).country_en ?? "",
      duration: (film as any).duration ?? "",
      synopsis_fr: (film as any).synopsis_fr ?? "",
      synopsis_en: (film as any).synopsis_en ?? "",
      classification_fr: (film as any).classification_fr ?? "",
      classification_en: (film as any).classification_en ?? "",
      youtube_url: (film as any).youtube_url ?? "",
      screening_time: film.screening_time ?? "",
      display_order: String(film.display_order),
      is_active: film.is_active,
    })
    setImageFile(null)
    setImagePreview(getImageUrl(film))
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
    if (!form.title_fr.trim()) { setError("Le titre FR est obligatoire"); return }
    setIsSaving(true); setError(null)
    
    try {
      const formData = new FormData()
      // Ajouter tous les champs texte
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
      
      // Ajouter le fichier image si présent
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const token = localStorage.getItem("admin_token")
      const url = editingFilm 
        ? `${api.baseURL}/films/${editingFilm.id}` 
        : `${api.baseURL}/films`
      
      const response = await fetch(url, {
        method: editingFilm ? "PUT" : "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'enregistrement")
      }

      setSuccess(editingFilm ? "Film mis à jour" : "Film créé")
      setShowModal(false)
      await loadFilms()
    } catch (e: any) {
      setError(e.message || "Erreur lors de la sauvegarde")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  async function handleToggleActive(film: Film) {
    try {
      await api.films.update(film.id, { is_active: !film.is_active })
      await loadFilms()
    } catch (e: any) { setError(e.message) }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await api.films.delete(deleteTarget.id)
      setSuccess("Film supprimé")
      setDeleteTarget(null)
      await loadFilms()
    } catch (e: any) { setError(e.message) }
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Catalogue Films</h1>
            <p className="text-muted-foreground">Importez vos affiches et gérez les détails des films</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> Ajouter un film
          </button>
        </div>

        {/* Alerts */}
        {error   && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">{error}</div>}
        {success && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">{success}</div>}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest w-16">Ordre</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest w-24">Affiche</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Titre du film</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Diffusion</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Année</th>
                <th className="text-left px-6 py-4 font-bold uppercase text-[10px] tracking-widest w-24">Statut</th>
                <th className="text-right px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr><td colSpan={7} className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
              )}
              {!isLoading && films.length === 0 && (
                <tr><td colSpan={7} className="text-center py-20 text-muted-foreground">Aucun film dans le catalogue. Importez-en un !</td></tr>
              )}
              {films.map((film) => (
                <tr key={film.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-muted-foreground">{film.display_order}</td>
                  <td className="px-6 py-4">
                    {getImageUrl(film)
                      ? <img src={getImageUrl(film)!} alt="" className="w-12 h-16 object-cover rounded-md shadow-md border border-border group-hover:scale-105 transition-transform" />
                      : <div className="w-12 h-16 bg-muted rounded-md flex items-center justify-center border border-dashed border-border"><ImageIcon className="w-5 h-5 text-muted-foreground/50" /></div>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground text-base">{film.title_fr}</p>
                    <p className="text-xs text-muted-foreground italic">{film.title_en}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{film.screening_time || "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{film.year || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${film.is_active ? "bg-green-100 text-green-700 border border-green-200" : "bg-muted text-muted-foreground border border-border"}`}>
                      {film.is_active ? "Actif" : "Masqué"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(film)} title="Modifier" className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleToggleActive(film)} title={film.is_active ? "Masquer" : "Afficher"} className="p-2 rounded-lg hover:bg-muted transition-all">
                        {film.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => setDeleteTarget(film)} title="Supprimer" className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL Create/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-border flex justify-between items-center bg-card">
                <h2 className="text-xl font-bold">{editingFilm ? "Modifier le film" : "Ajouter un nouveau film"}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-full"><Plus className="rotate-45 w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Upload Image Section */}
                  <div className="md:col-span-1 space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Affiche du film</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[3/4] rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden relative group"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                          <p className="text-xs text-center text-muted-foreground px-4">Cliquez pour importer l'image</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                    <p className="text-[10px] text-muted-foreground italic text-center">JPG, PNG, WEBP (Max 5Mo)</p>
                  </div>

                  {/* Fields Section */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Titre (FR) *</label>
                        <input
                          type="text"
                          value={form.title_fr}
                          onChange={(e) => setForm((f) => ({ ...f, title_fr: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Ex: Le Roi Lion"
                        />
                      </div>
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Titre (EN)</label>
                        <input
                          type="text"
                          value={form.title_en}
                          onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Ex: The Lion King"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Genre</label>
                        <input
                          type="text"
                          value={form.genre_fr}
                          onChange={(e) => setForm((f) => ({ ...f, genre_fr: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                          placeholder="Animation, Aventure"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Année</label>
                        <input
                          type="text"
                          value={form.year}
                          onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                          placeholder="2024"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Durée</label>
                        <input
                          type="text"
                          value={form.duration}
                          onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                          placeholder="1h 45min"
                        />
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Heure de diffusion</label>
                    <input
                      type="text"
                      value={form.screening_time}
                      onChange={(e) => setForm((f) => ({ ...f, screening_time: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                      placeholder="Samedi 19h30"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Lien YouTube (Trailer)</label>
                    <input
                      type="text"
                      value={form.youtube_url}
                      onChange={(e) => setForm((f) => ({ ...f, youtube_url: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                {/* Synopsis bilingual */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Synopsis (FR)</label>
                  <textarea
                    value={form.synopsis_fr}
                    onChange={(e) => setForm((f) => ({ ...f, synopsis_fr: e.target.value }))}
                    rows={4}
                    className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Résumé du film en français..."
                  />
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-sm font-bold">Film actif</p>
                    <p className="text-xs text-muted-foreground">Visible immédiatement par les spectateurs sur le site public.</p>
                  </div>
                </label>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-3 bg-card">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving} 
                  className="px-8 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</> : "Enregistrer le film"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL Delete */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background border border-border rounded-2xl w-full max-w-md p-8 space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                <Trash2 size={32} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-foreground">Supprimer le film</h2>
                <p className="text-sm text-muted-foreground">
                  Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget.title_fr}</strong> ? 
                  Cette action supprimera également le fichier de l'affiche sur le serveur.
                </p>
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
