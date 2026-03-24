"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Search, Filter, ChevronRight, ChevronLeft, Download } from "lucide-react"
import { api } from "@/lib/api"

interface ReservationRow {
  id: string
  nom: string
  telephone: string
  pack: string
  statut: string
  prixTotal: number
  totalPayé: number
  dateReservation: string
}

interface PaginationData {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const PAGE_SIZE = 10

export default function ReservationsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState<ReservationRow[]>([])
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("tous")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    if (isAuthenticated) {
      loadReservations()
    }
  }, [isAuthenticated, currentPage, statusFilter])

  const loadReservations = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const res = await api.reservations.getAll()
      const raw = res.reservations ?? []

      const mapped: ReservationRow[] = raw.map((r: any) => ({
        id: r.id,
        nom: r.payeur_name,
        telephone: r.payeur_phone,
        pack: r.pack?.name || "Pack inconnu",
        statut: mapBackendStatus(r.status),
        prixTotal: r.total_price,
        totalPayé: r.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0,
        dateReservation: new Date(r.createdAt).toLocaleDateString("fr-FR"),
      }))

      setReservations(mapped)

      // Pagination client-side
      const filtered = filterReservations(mapped, search, statusFilter)
      const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
      setPagination({ total: filtered.length, page: currentPage, pageSize: PAGE_SIZE, totalPages })
    } catch (err) {
      console.error("Erreur API réservations", err)
      setError("Erreur lors du chargement des réservations")
    } finally {
      setIsLoading(false)
    }
  }

  const filterReservations = (data: ReservationRow[], q: string, status: string) => {
    let result = [...data]
    if (q) result = result.filter((r) => r.nom.toLowerCase().includes(q.toLowerCase()) || r.telephone.includes(q))
    if (status !== "tous") result = result.filter((r) => r.statut === status)
    return result
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    const filtered = filterReservations(reservations, search, statusFilter)
    setPagination({ total: filtered.length, page: 1, pageSize: PAGE_SIZE, totalPages: Math.ceil(filtered.length / PAGE_SIZE) })
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
    const filtered = filterReservations(reservations, search, status)
    setPagination({ total: filtered.length, page: 1, pageSize: PAGE_SIZE, totalPages: Math.ceil(filtered.length / PAGE_SIZE) })
  }

  const mapBackendStatus = (status: string) => {
    switch (status) {
      case "pending": return "en_attente"
      case "partial": return "partiel"
      case "paid": return "payé"
      case "ticket_generated": return "ticket_généré"
      default: return "en_attente"
    }
  }

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, string> = {
      en_attente: "bg-yellow-100 text-yellow-900",
      partiel: "bg-orange-100 text-orange-900",
      payé: "bg-green-100 text-green-900",
      ticket_généré: "bg-blue-100 text-blue-900",
    }
    const labels: Record<string, string> = {
      en_attente: "En attente",
      partiel: "Partiel",
      payé: "Payé",
      ticket_généré: "Ticket généré",
    }
    return { className: variants[statut] ?? "bg-muted text-muted-foreground", label: labels[statut] ?? statut }
  }

  const montantRestant = (r: ReservationRow) => r.prixTotal - r.totalPayé

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Redirection...</p>
        </div>
      </AdminLayout>
    )
  }

  const filteredReservations = filterReservations(reservations, search, statusFilter)
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const enAttenteCount = reservations.filter((r) => r.statut === "en_attente").length
  const payéCount = reservations.filter((r) => r.statut === "payé" || r.statut === "ticket_généré").length
  const partielCount = reservations.filter((r) => r.statut === "partiel").length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Réservations</h1>
            <p className="text-muted-foreground">Total: {reservations.length} réservation(s)</p>
          </div>
          <a
            href={`${api.baseURL}/reservations/export${statusFilter !== "tous" ? `?status=${statusFilter}` : ""}`}
            download
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </a>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-900 px-4 py-3 rounded">{error}</div>}

        {/* Search + Filter */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom ou téléphone (ex: 672475691)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors text-sm md:text-base"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors text-sm md:text-base appearance-none"
              >
                <option value="tous">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="partiel">Partiel</option>
                <option value="payé">Payé</option>
                <option value="ticket_généré">Ticket généré</option>
              </select>
            </div>
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
            <p className="text-muted-foreground text-sm mb-2">En attente</p>
            <p className="text-3xl font-bold text-yellow-600">{enAttenteCount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Partiel</p>
            <p className="text-3xl font-bold text-orange-600">{partielCount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Payé / Ticket généré</p>
            <p className="text-3xl font-bold text-green-700">{payéCount}</p>
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
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Nom</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Téléphone</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Pack</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Statut</th>
                      <th className="px-4 md:px-6 py-3 text-right text-sm font-semibold text-foreground whitespace-nowrap">Total</th>
                      <th className="px-4 md:px-6 py-3 text-right text-sm font-semibold text-foreground whitespace-nowrap">Payé</th>
                      <th className="px-4 md:px-6 py-3 text-right text-sm font-semibold text-foreground whitespace-nowrap">Restant</th>
                      <th className="px-4 md:px-6 py-3 text-center text-sm font-semibold text-foreground whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReservations.map((r) => {
                      const badge = getStatutBadge(r.statut)
                      return (
                        <tr key={r.id} className="hover:bg-secondary/50 transition-colors border-t border-border">
                          <td className="px-4 md:px-6 py-3 text-sm text-foreground whitespace-nowrap">{r.nom}</td>
                          <td className="px-4 md:px-6 py-3 text-sm text-muted-foreground whitespace-nowrap">{r.telephone}</td>
                          <td className="px-4 md:px-6 py-3 text-sm text-foreground whitespace-nowrap">{r.pack}</td>
                          <td className="px-4 md:px-6 py-3 text-sm whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${badge.className}`}>{badge.label}</span>
                          </td>
                          <td className="px-4 md:px-6 py-3 text-right text-sm font-medium whitespace-nowrap">
                            {r.prixTotal.toLocaleString()} XAF
                          </td>
                          <td className="px-4 md:px-6 py-3 text-right text-sm text-green-700 font-medium whitespace-nowrap">
                            {r.totalPayé.toLocaleString()} XAF
                          </td>
                          <td className="px-4 md:px-6 py-3 text-right text-sm text-orange-600 font-medium whitespace-nowrap">
                            {montantRestant(r).toLocaleString()} XAF
                          </td>
                          <td className="px-4 md:px-6 py-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => router.push(`/admin/reservation/${r.id}`)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors text-xs font-medium"
                            >
                              <ChevronRight className="w-4 h-4" />
                              <span className="hidden sm:inline">Ouvrir</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {filteredReservations.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Aucune réservation trouvée</p>
                  </div>
                )}
              </>
            )}
          </div>

          {!isLoading && Math.ceil(filteredReservations.length / PAGE_SIZE) > 1 && (
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-border bg-secondary/20">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} sur {Math.ceil(filteredReservations.length / PAGE_SIZE)} ({filteredReservations.length} réservations)
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
                  onClick={() => { if (currentPage < Math.ceil(filteredReservations.length / PAGE_SIZE)) setCurrentPage(currentPage + 1) }}
                  disabled={currentPage === Math.ceil(filteredReservations.length / PAGE_SIZE)}
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
