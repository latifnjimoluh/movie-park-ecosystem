"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Search, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react"
import { api } from "@/lib/api"

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api"

interface AuditLog {
  id: string
  permission: string
  entity_type: string
  entity_id: string
  action: string
  description: string
  status: "success" | "failed"
  ip_address: string
  created_at: string
  user?: { name: string; email: string }
}

const ACTION_LABELS: Record<string, string> = {
  create: "Créer",
  read: "Lire",
  update: "Modifier",
  delete: "Supprimer",
  export: "Exporter",
  validate: "Valider",
}

const ENTITY_LABELS: Record<string, string> = {
  reservation: "Réservation",
  pack: "Pack",
  payment: "Paiement",
  ticket: "Ticket",
  scan: "Scan",
  participant: "Participant",
  user: "Utilisateur",
}

export default function AuditPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      router.push("/admin/login")
      return
    }
    loadLogs()
  }, [router])

  const loadLogs = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch(`${BASE_URL}/audit/logs?limit=200`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const json = await res.json()
      setLogs(json.data || [])
    } catch (err) {
      console.error("Erreur audit logs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = logs.filter((log) => {
    if (search) {
      const s = search.toLowerCase()
      if (
        !log.description?.toLowerCase().includes(s) &&
        !log.permission?.toLowerCase().includes(s) &&
        !log.user?.name?.toLowerCase().includes(s)
      )
        return false
    }
    if (actionFilter !== "all" && log.action !== actionFilter) return false
    if (entityFilter !== "all" && log.entity_type !== entityFilter) return false
    if (statusFilter !== "all" && log.status !== statusFilter) return false
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              Journal d'audit
            </h1>
            <p className="text-muted-foreground mt-1">{filtered.length} entrée(s)</p>
          </div>
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none"
          >
            <option value="all">Toutes les actions</option>
            {Object.entries(ACTION_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none"
          >
            <option value="all">Toutes les entités</option>
            {Object.entries(ENTITY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="success">Succès</option>
            <option value="failed">Échec</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Chargement...</div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Utilisateur</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Entité</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Description</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{log.user?.name || "Système"}</span>
                        {log.user?.email && (
                          <p className="text-xs text-muted-foreground">{log.user.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium
                          ${log.action === "delete" ? "bg-red-500/20 text-red-400" :
                            log.action === "create" ? "bg-green-500/20 text-green-400" :
                            log.action === "update" ? "bg-blue-500/20 text-blue-400" :
                            "bg-secondary text-foreground"}`}>
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {ENTITY_LABELS[log.entity_type] || log.entity_type}
                      </td>
                      <td className="px-4 py-3 text-foreground max-w-xs truncate" title={log.description}>
                        {log.description || log.permission}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {log.status === "success" ? (
                          <span className="inline-flex items-center gap-1 text-green-500 text-xs">
                            <ShieldCheck className="w-3 h-3" /> OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 text-xs">
                            <AlertCircle className="w-3 h-3" /> Échec
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="p-12 text-center">
                  <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium">Aucun log trouvé</p>
                  <p className="text-muted-foreground text-sm mt-1">Modifiez vos filtres ou attendez que des actions soient effectuées</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
