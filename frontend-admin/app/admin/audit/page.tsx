"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Search, ShieldCheck, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"

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

const PAGE_SIZE = 10

export default function AuditPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    if (isAuthenticated) loadLogs()
  }, [isAuthenticated])

  const loadLogs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch(`${BASE_URL}/audit/logs?limit=500`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const json = await res.json()
      if (res.ok) {
        setLogs(json.data || [])
      } else {
        setError("Impossible de charger les logs")
      }
    } catch (err) {
      console.error("Erreur audit logs:", err)
      setError("Erreur lors du chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Redirection...</p>
        </div>
      </AdminLayout>
    )
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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const successCount = logs.filter((l) => l.status === "success").length
  const failedCount = logs.filter((l) => l.status === "failed").length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              Journal d'audit
            </h1>
            <p className="text-muted-foreground">Total: {logs.length} entrée(s)</p>
          </div>
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-900 px-4 py-3 rounded">{error}</div>}

        {/* Search + Filters */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); handleFilterChange() }}
            className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">Toutes les actions</option>
            {Object.entries(ACTION_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <select
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value); handleFilterChange() }}
            className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">Toutes les entités</option>
            {Object.entries(ENTITY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange() }}
              className="flex-1 px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">Tous les statuts</option>
              <option value="success">Succès</option>
              <option value="failed">Échec</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors text-sm font-medium whitespace-nowrap"
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Total des logs</p>
            <p className="text-3xl font-bold text-foreground">{logs.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Succès</p>
            <p className="text-3xl font-bold text-green-700">{successCount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Échecs</p>
            <p className="text-3xl font-bold text-red-700">{failedCount}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left font-semibold text-foreground whitespace-nowrap">Date</th>
                      <th className="px-4 md:px-6 py-3 text-left font-semibold text-foreground whitespace-nowrap">Utilisateur</th>
                      <th className="px-4 md:px-6 py-3 text-left font-semibold text-foreground whitespace-nowrap">Action</th>
                      <th className="px-4 md:px-6 py-3 text-left font-semibold text-foreground whitespace-nowrap">Entité</th>
                      <th className="px-4 md:px-6 py-3 text-left font-semibold text-foreground whitespace-nowrap">Description</th>
                      <th className="px-4 md:px-6 py-3 text-center font-semibold text-foreground whitespace-nowrap">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((log) => (
                      <tr key={log.id} className="hover:bg-secondary/50 transition-colors border-t border-border">
                        <td className="px-4 md:px-6 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                          <span className="font-medium text-foreground">{log.user?.name || "Système"}</span>
                          {log.user?.email && (
                            <p className="text-xs text-muted-foreground">{log.user.email}</p>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            log.action === "delete" ? "bg-red-100 text-red-900" :
                            log.action === "create" ? "bg-green-100 text-green-900" :
                            log.action === "update" ? "bg-blue-100 text-blue-900" :
                            "bg-muted text-foreground"
                          }`}>
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 text-muted-foreground whitespace-nowrap">
                          {ENTITY_LABELS[log.entity_type] || log.entity_type}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-foreground max-w-xs truncate" title={log.description}>
                          {log.description || log.permission}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-center whitespace-nowrap">
                          {log.status === "success" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-900">
                              <ShieldCheck className="w-3 h-3" /> Succès
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-900">
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
              </>
            )}
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-border bg-secondary/20">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} ({filtered.length} entrées)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { if (currentPage > 1) setCurrentPage(currentPage - 1) }}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>
                <button
                  onClick={() => { if (currentPage < totalPages) setCurrentPage(currentPage + 1) }}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
