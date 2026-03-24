"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { User, Lock, Save } from "lucide-react"
import { api } from "@/lib/api"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  createdAt: string
}

const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Administrateur",
  cashier: "Caissier",
  scanner: "Contrôleur",
  operator: "Opérateur",
}

export default function SettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadProfile()
    }
  }, [router])

  const loadProfile = async () => {
    setIsLoadingProfile(true)
    try {
      const res = await fetch(`${api.baseURL}/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      })
      const json = await res.json()
      if (res.ok) {
        setProfile(json.data ?? json.user ?? json)
      }
    } catch (err) {
      console.error("Erreur chargement profil", err)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setIsSavingPassword(true)
    try {
      const res = await fetch(`${api.baseURL}/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const json = await res.json()
      if (res.ok) {
        setPasswordSuccess("Mot de passe mis à jour avec succès")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setPasswordSuccess(null), 4000)
      } else {
        setPasswordError(json.message || "Erreur lors de la mise à jour")
      }
    } catch (err) {
      setPasswordError("Erreur réseau")
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez votre profil et votre mot de passe</p>
        </div>

        {/* Profil */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-muted/30">
            <User className="w-4 h-4" />
            <h2 className="font-semibold text-sm">Mon profil</h2>
          </div>

          {isLoadingProfile ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Chargement...</div>
          ) : profile ? (
            <div className="divide-y divide-border">
              {[
                { label: "Nom", value: profile.name },
                { label: "Email", value: profile.email },
                { label: "Téléphone", value: profile.phone || "—" },
                { label: "Rôle", value: ROLE_LABELS[profile.role] ?? profile.role },
                {
                  label: "Membre depuis",
                  value: new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit", month: "long", year: "numeric",
                  }),
                },
              ].map(({ label, value }) => (
                <div key={label} className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">Impossible de charger le profil</div>
          )}
        </div>

        {/* Changer mot de passe */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-muted/30">
            <Lock className="w-4 h-4" />
            <h2 className="font-semibold text-sm">Changer le mot de passe</h2>
          </div>

          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            {passwordError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mot de passe actuel</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              <Save size={16} />
              {isSavingPassword ? "Enregistrement…" : "Mettre à jour le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
