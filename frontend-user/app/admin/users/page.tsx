"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Plus, Trash2, CheckCircle, XCircle, Shield, Users } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog"
import { PermissionsMatrix } from "@/components/admin/permissions-matrix"

interface AdminUser {
  id: string
  nom: string
  email: string
  role: "SuperAdmin" | "Comptabilité" | "Contrôle Entrée" | "Gestion Packs" | "Lecture seule"
  statut: "actif" | "inactif"
  derniere_connexion: string
}

export default function UsersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: "1",
      nom: "Admin Principal",
      email: "admin@moviepark.cm",
      role: "SuperAdmin",
      statut: "actif",
      derniere_connexion: "2025-12-28 14:30",
    },
    {
      id: "2",
      nom: "Jean Comptable",
      email: "jean@moviepark.cm",
      role: "Comptabilité",
      statut: "actif",
      derniere_connexion: "2025-12-28 09:15",
    },
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAdmin, setNewAdmin] = useState<{ nom: string; email: string; role: AdminUser["role"] }>({ nom: "", email: "", role: "Contrôle Entrée" })

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [router])

  const handleAddAdmin = () => {
    if (!newAdmin.nom || !newAdmin.email) return

    const admin: AdminUser = {
      id: Date.now().toString(),
      nom: newAdmin.nom,
      email: newAdmin.email,
      role: newAdmin.role,
      statut: "actif",
      derniere_connexion: "-",
    }

    setAdmins([...admins, admin])
    setNewAdmin({ nom: "", email: "", role: "Contrôle Entrée" })
    setShowAddModal(false)
  }

  const handleDeleteAdmin = (id: string) => {
    setAdmins(admins.filter((a) => a.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setAdmins(admins.map((a) => (a.id === id ? { ...a, statut: a.statut === "actif" ? "inactif" : "actif" } : a)))
  }

  const [activeTab, setActiveTab] = useState<"users" | "permissions">("users")

  if (isLoading || !isAuthenticated) return null

  const roles = ["SuperAdmin", "Comptabilité", "Contrôle Entrée", "Gestion Packs", "Lecture seule"]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accès & Sécurité</h1>
            <p className="text-muted-foreground">Gérez les administrateurs et configurez leurs droits d'accès</p>
          </div>
          
          {activeTab === "users" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-lg font-medium transition-colors w-fit"
            >
              <Plus className="w-4 h-4" />
              Ajouter un admin
            </button>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "users" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            Liste des Admins
          </button>
          <button
            onClick={() => setActiveTab("permissions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "permissions" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="w-4 h-4" />
            Matrice des Droits
          </button>
        </div>

        {activeTab === "users" ? (
          /* Admins Table */
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="p-4 text-left font-semibold text-muted-foreground">Nom</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Adresse e-mail</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Rôle</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Statut</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Dernière connexion</th>
                    <th className="p-4 text-right font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-medium text-foreground">{admin.nom}</td>
                      <td className="p-4 text-muted-foreground">{admin.email}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-blue-100 text-blue-900 border border-blue-200">
                          {admin.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {admin.statut === "actif" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-foreground capitalize">{admin.statut}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{admin.derniere_connexion}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(admin.id)}
                            title={admin.statut === "actif" ? "Désactiver" : "Activer"}
                            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
                          >
                            {admin.statut === "actif" ? (
                              <XCircle className="w-4 h-4 text-orange-600" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            title="Supprimer"
                            className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PermissionsMatrix />
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Ajouter un administrateur</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte administrateur en remplissant les informations ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
              <input
                type="text"
                value={newAdmin.nom}
                onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
                placeholder="Anas Farid"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Adresse e-mail</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="latifnjimoluh@gmail.com"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rôle</label>
              <select
                value={newAdmin.role}
                onChange={(e) =>
                  setNewAdmin({
                    ...newAdmin,
                    role: e.target.value as AdminUser["role"],
                  })
                }
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors font-medium text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleAddAdmin}
              className="px-4 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors font-medium text-sm"
            >
              Créer l'admin
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
