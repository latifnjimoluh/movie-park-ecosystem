"use client"

import { useState, useEffect, Fragment } from "react"
import { api } from "@/lib/api"
import { Check, X, Save, Shield, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface Role {
  id: string
  name: string
  label: string
  permissions: string[]
}

// Liste de référence de toutes les permissions possibles dans le système
const ALL_AVAILABLE_PERMISSIONS = [
  "reservations.view", "reservations.view.all", "reservations.create", "reservations.edit", 
  "reservations.edit.status", "reservations.delete", "reservations.export", "reservations.statistics",
  "payments.view", "payments.view.all", "payments.create", "payments.edit", "payments.delete", 
  "payments.export", "payments.approve", "payments.statistics",
  "tickets.view", "tickets.view.all", "tickets.create", "tickets.generate", "tickets.download", "tickets.preview",
  "scan.validate", "scan.decode", "scan.search", "scan.statistics",
  "packs.view", "packs.view.all", "packs.create", "packs.edit", "packs.delete",
  "users.view", "users.view.all", "users.create", "users.edit", "users.manage_permissions",
  "audit.view.all", "content.view", "content.create", "content.edit", "content.delete"
].sort()

export function PermissionsMatrix() {
  const [roles, setRoles] = useState<Role[]>([])
  const [editedRoles, setEditedRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<string | null>(null) // ID du rôle en cours de sauvegarde
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    setIsLoading(true)
    try {
      const res = await api.roles.getAll()
      setRoles(res)
      setEditedRoles(JSON.parse(JSON.stringify(res))) // Deep copy
    } catch (err) {
      console.error("Error loading roles:", err)
      toast({
        title: "Erreur",
        description: "Impossible de charger les rôles depuis la base de données.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePermission = (roleId: string, permission: string) => {
    setEditedRoles(prev => prev.map(role => {
      if (role.id !== roleId) return role
      
      // Sécurité superadmin
      if (role.name === 'superadmin') return role

      const hasPerm = role.permissions.includes(permission)
      const newPerms = hasPerm 
        ? role.permissions.filter(p => p !== permission)
        : [...role.permissions, permission]
      
      return { ...role, permissions: newPerms }
    }))
  }

  const saveRolePermissions = async (roleId: string) => {
    const roleToSave = editedRoles.find(r => r.id === roleId)
    if (!roleToSave) return

    setIsSaving(roleId)
    try {
      await api.roles.updatePermissions(roleId, roleToSave.permissions)
      toast({
        title: "Succès",
        description: `Permissions pour "${roleToSave.label}" mises à jour.`,
      })
      // Mettre à jour l'état original
      setRoles(prev => prev.map(r => r.id === roleId ? JSON.parse(JSON.stringify(roleToSave)) : r))
    } catch (err) {
      console.error("Error saving role permissions:", err)
      toast({
        title: "Erreur",
        description: "Échec de la sauvegarde.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Chargement des droits d'accès...</p>
      </div>
    )
  }

  const filteredPermissions = ALL_AVAILABLE_PERMISSIONS.filter(p => 
    p.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedPermissions: Record<string, string[]> = {}
  filteredPermissions.forEach(p => {
    const category = p.split('.')[0] || 'Général'
    if (!groupedPermissions[category]) groupedPermissions[category] = []
    groupedPermissions[category].push(p)
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Gestion des Rôles & Permissions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Les modifications sont enregistrées par rôle et stockées en base de données.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text"
            placeholder="Filtrer les permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
          />
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 text-left font-semibold text-muted-foreground sticky left-0 bg-muted/50 z-10 w-64">Permission</th>
                {editedRoles.map(role => (
                  <th key={role.id} className="p-4 text-center min-w-[120px]">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-bold uppercase tracking-wider text-[10px]">{role.label}</span>
                      {role.name !== 'superadmin' && (
                        <Button 
                          size="sm" 
                          variant={JSON.stringify(role.permissions) !== JSON.stringify(roles.find(r => r.id === role.id)?.permissions) ? "default" : "outline"}
                          className="h-7 text-[10px] px-2"
                          disabled={isSaving === role.id || JSON.stringify(role.permissions) === JSON.stringify(roles.find(r => r.id === role.id)?.permissions)}
                          onClick={() => saveRolePermissions(role.id)}
                        >
                          {isSaving === role.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                          Sauver
                        </Button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <Fragment key={category}>
                  <tr className="bg-muted/20">
                    <td colSpan={editedRoles.length + 1} className="px-4 py-2 font-bold text-primary uppercase text-[10px] tracking-widest">
                      {category}
                    </td>
                  </tr>
                  {perms.map(permission => (
                    <tr key={permission} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium border-r border-border sticky left-0 bg-card z-10">
                        <code>{permission}</code>
                      </td>
                      {editedRoles.map(role => {
                        const isGranted = role.permissions.includes(permission)
                        const isSuperAdmin = role.name === 'superadmin'
                        
                        return (
                          <td 
                            key={`${role.id}-${permission}`} 
                            className={`p-2 text-center ${isSuperAdmin ? 'bg-slate-50/50' : 'cursor-pointer hover:bg-primary/5'}`}
                            onClick={() => !isSuperAdmin && togglePermission(role.id, permission)}
                          >
                            <div className="flex justify-center">
                              {isGranted ? (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSuperAdmin ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-green-600 shadow-sm'}`}>
                                  <Check className="w-4 h-4 bold" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-50 text-red-200">
                                  <X className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
