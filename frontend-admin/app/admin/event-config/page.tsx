"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Save, RotateCcw, Info } from "lucide-react"
import { api } from "@/lib/api"

// Définition des champs de configuration avec leurs labels et groupes
const CONFIG_FIELDS = [
  // ─── Groupe : Héro ───────────────────────────────────────────────────────
  { key: "edition_label",    label: "Badge édition",                  group: "hero",    placeholder: "🐣 Édition Pâques 2026",                             type: "text",    hint: "Affiché dans le badge jaune en haut du Hero" },
  { key: "tagline",          label: "Tagline principale",             group: "hero",    placeholder: "Une soirée cinéma unique, sous les étoiles de Yaoundé.", type: "text",  hint: "Phrase d'accroche principale sous le titre" },
  { key: "subtitle",         label: "Sous-tagline",                   group: "hero",    placeholder: "Ambiance · Films · Expérience Printanière",           type: "text",    hint: "Texte secondaire en italique et doré" },
  { key: "social_proof",     label: "Preuve sociale",                 group: "hero",    placeholder: "🎟️ Plus de 100 participants lors de la dernière édition", type: "text", hint: "Petite ligne en bas du Hero" },
  { key: "particle_symbols", label: "Symboles particules (JSON)",     group: "hero",    placeholder: '["🌸","🌼","🌿","🥚","✨"]',                          type: "json",    hint: "Tableau JSON de symboles emoji pour l'animation de fond" },
  // ─── Groupe : Localisation ───────────────────────────────────────────────
  { key: "location_lat",     label: "Latitude GPS",                   group: "location", placeholder: "3.876146",                                           type: "number",  hint: "Latitude pour le lien Google Maps" },
  { key: "location_lng",     label: "Longitude GPS",                  group: "location", placeholder: "11.518691",                                          type: "number",  hint: "Longitude pour le lien Google Maps" },
  // ─── Groupe : Films ──────────────────────────────────────────────────────
  { key: "films_badge",      label: "Badge section Films",            group: "films",   placeholder: "🎬 Programme Pâques 2026",                            type: "text",    hint: "Badge vert dans la section films de l'accueil" },
  { key: "films_description",label: "Description section Films",      group: "films",   placeholder: "Deux films soigneusement sélectionnés…",              type: "text",    hint: "Sous-titre de la section films sur l'accueil" },
  // ─── Groupe : Pricing ────────────────────────────────────────────────────
  { key: "pricing_badge",    label: "Badge section Tarifs",           group: "pricing", placeholder: "🎟️ Choisissez votre expérience",                      type: "text",    hint: "Badge jaune dans la section tarifs" },
  // ─── Groupe : Contact ────────────────────────────────────────────────────
  { key: "contact_phone",    label: "Téléphone affiché",              group: "contact", placeholder: "672475691",                                   type: "text",    hint: "Numéro affiché dans le footer et la page contact" },
  { key: "contact_email",    label: "Email affiché",                  group: "contact", placeholder: "matangabrooklyn@gmail.com",                           type: "text",    hint: "Email affiché dans le footer et la page contact" },
  { key: "contact_whatsapp", label: "Numéro WhatsApp (sans +)",       group: "contact", placeholder: "237697304450",                                        type: "text",    hint: "Numéro WhatsApp sans le + ni espaces" },
] as const

const GROUPS: Array<{ key: string; label: string; emoji: string }> = [
  { key: "hero",     label: "Section Hero (accueil)",   emoji: "🌟" },
  { key: "location", label: "Localisation GPS",         emoji: "📍" },
  { key: "films",    label: "Section Films",            emoji: "🎬" },
  { key: "pricing",  label: "Section Tarifs",           emoji: "🎟️" },
  { key: "contact",  label: "Contact & Coordonnées",    emoji: "📞" },
]

type ConfigValues = Record<string, string>
type DirtyMap = Record<string, boolean>

export default function EventConfigPage() {
  const router = useRouter()
  const [values, setValues]     = useState<ConfigValues>({})
  const [original, setOriginal] = useState<ConfigValues>({})
  const [dirty, setDirty]       = useState<DirtyMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving]   = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [success, setSuccess]     = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) { router.push("/admin/login"); return }
    loadConfig()
  }, [router])

  async function loadConfig() {
    setIsLoading(true); setError(null)
    try {
      const res = await api.eventConfig.getAll()
      // res.merged contient la fusion defaults + BD
      const merged: ConfigValues = res.merged ?? res.data?.merged ?? {}
      setValues({ ...merged })
      setOriginal({ ...merged })
      setDirty({})
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement")
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(key: string, val: string) {
    setValues((v) => ({ ...v, [key]: val }))
    setDirty((d) => ({ ...d, [key]: val !== (original[key] ?? "") }))
  }

  function handleReset(key: string) {
    setValues((v) => ({ ...v, [key]: original[key] ?? "" }))
    setDirty((d) => ({ ...d, [key]: false }))
  }

  async function handleSaveAll() {
    const changedKeys = Object.keys(dirty).filter((k) => dirty[k])
    if (changedKeys.length === 0) { setSuccess("Aucune modification à sauvegarder"); setTimeout(() => setSuccess(null), 2000); return }

    setIsSaving(true); setError(null)
    try {
      const configs = changedKeys.map((key) => {
        const field = CONFIG_FIELDS.find((f) => f.key === key)
        return {
          key,
          value: values[key] ?? "",
          type: field?.type ?? "text",
          label: field?.label ?? key,
          group: field?.group ?? "general",
        }
      })
      await api.eventConfig.bulkUpsert(configs)
      setSuccess(`${changedKeys.length} configuration(s) sauvegardée(s)`)
      setOriginal({ ...values })
      setDirty({})
    } catch (e: any) {
      setError(e.message || "Erreur lors de la sauvegarde")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const totalDirty = Object.values(dirty).filter(Boolean).length

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Configuration de l'événement</h1>
            <p className="text-sm text-muted-foreground">
              Modifiez les textes, coordonnées et visuels du site public — sans toucher au code.
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving || totalDirty === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40"
          >
            <Save size={16} />
            {isSaving ? "Sauvegarde…" : `Sauvegarder${totalDirty > 0 ? ` (${totalDirty})` : ""}`}
          </button>
        </div>

        {error   && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{success}</div>}

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">Chargement de la configuration…</div>
        ) : (
          GROUPS.map((group) => {
            const fields = CONFIG_FIELDS.filter((f) => f.group === group.key)
            if (fields.length === 0) return null
            return (
              <div key={group.key} className="rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-4 bg-muted/30 border-b border-border flex items-center gap-2">
                  <span className="text-base">{group.emoji}</span>
                  <h2 className="font-semibold text-sm">{group.label}</h2>
                </div>
                <div className="divide-y divide-border">
                  {fields.map((field) => {
                    const isDirty = dirty[field.key] === true
                    return (
                      <div key={field.key} className={`px-5 py-4 flex flex-col gap-2 ${isDirty ? "bg-yellow-500/5" : ""}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <label className="text-sm font-medium">{field.label}</label>
                              {isDirty && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-500 font-medium">modifié</span>
                              )}
                            </div>
                            {field.hint && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                <Info size={11} /> {field.hint}
                              </p>
                            )}
                            {field.type === "json" ? (
                              <textarea
                                value={values[field.key] ?? ""}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            ) : (
                              <input
                                type="text"
                                value={values[field.key] ?? ""}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            )}
                          </div>
                          {isDirty && (
                            <button
                              onClick={() => handleReset(field.key)}
                              title="Annuler cette modification"
                              className="mt-7 p-1.5 rounded hover:bg-muted text-muted-foreground flex-shrink-0"
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}

        {/* Footer save */}
        {totalDirty > 0 && (
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{totalDirty} modification(s) non sauvegardée(s)</p>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40"
            >
              <Save size={16} />
              {isSaving ? "Sauvegarde…" : "Sauvegarder tout"}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
