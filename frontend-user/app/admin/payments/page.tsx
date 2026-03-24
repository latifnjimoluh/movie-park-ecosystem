"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { api } from "@/lib/api"

interface Payment {
  id: string
  nomPayeur: string
  telephone: string
  montant: number
  mode: string
  date: string
  admin: string
  reservationId: string
}

interface PaginationData {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const PAGE_SIZE = 10

export default function PaymentsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [modeFilter, setModeFilter] = useState<string>("tous")
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
      loadPayments()
    }
  }, [isAuthenticated, currentPage, modeFilter])

  const loadPayments = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: PAGE_SIZE.toString(),
        ...(search && { q: search }),
      })

      const response = await fetch(`${api.baseURL}/payments?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      })

      const result = await response.json()

      if (result.status === 200) {
        const raw = result.data?.payments ?? []
        const pag = result.data?.pagination ?? { total: raw.length, page: 1, pageSize: PAGE_SIZE, totalPages: Math.ceil(raw.length / PAGE_SIZE) }

        const mapped: Payment[] = raw.map((p: any) => ({
          id: p.id,
          nomPayeur: p.reservation?.payeur_name ?? "—",
          telephone: p.reservation?.payeur_phone ?? "—",
          montant: p.amount,
          mode: p.method,
          date: new Date(p.createdAt).toLocaleDateString("fr-FR"),
          admin: p.creator?.name ?? "—",
          reservationId: p.reservation_id,
        }))

        setPayments(mapped)
        setPagination(pag)
      } else {
        setError("Impossible de charger les paiements")
      }
    } catch (err) {
      console.error("Erreur API paiements", err)
      setError("Erreur lors du chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadPayments()
  }

  const handleModeChange = (mode: string) => {
    setModeFilter(mode)
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

  const filtered = modeFilter === "tous" ? payments : payments.filter((p) => p.mode.toLowerCase() === modeFilter)
  const totalMontant = filtered.reduce((sum, p) => sum + p.montant, 0)
  const momoCount = payments.filter((p) => p.mode.toLowerCase() === "momo").length
  const orangeCount = payments.filter((p) => p.mode.toLowerCase() === "orange").length
  const cashCount = payments.filter((p) => p.mode.toLowerCase() === "cash").length

  const modeLabel = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "momo": return "Mobile Money"
      case "orange": return "Orange Money"
      case "cash": return "Espèces"
      default: return mode
    }
  }

  const modeBadgeClass = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "momo": return "bg-blue-100 text-blue-900"
      case "orange": return "bg-orange-100 text-orange-900"
      case "cash": return "bg-purple-100 text-purple-900"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Paiements</h1>
          <p className="text-muted-foreground">Total: {pagination.total} paiement(s)</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-900 px-4 py-3 rounded">{error}</div>}

        {/* Search + Filter */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom ou téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors text-sm md:text-base"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={modeFilter}
                onChange={(e) => handleModeChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors text-sm md:text-base appearance-none"
              >
                <option value="tous">Tous les modes</option>
                <option value="momo">Mobile Money (MoMo)</option>
                <option value="orange">Orange Money</option>
                <option value="cash">Espèces (Cash)</option>
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
            <p className="text-muted-foreground text-sm mb-2">Mobile Money</p>
            <p className="text-3xl font-bold text-blue-700">{momoCount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Orange Money</p>
            <p className="text-3xl font-bold text-orange-600">{orangeCount}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Espèces</p>
            <p className="text-3xl font-bold text-purple-700">{cashCount}</p>
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
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Nom du payeur</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Téléphone</th>
                      <th className="px-4 md:px-6 py-3 text-right text-sm font-semibold text-foreground whitespace-nowrap">Montant</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Mode</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Date</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap">Admin</th>
                      <th className="px-4 md:px-6 py-3 text-center text-sm font-semibold text-foreground whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((payment) => (
                      <tr key={payment.id} className="hover:bg-secondary/50 transition-colors border-t border-border">
                        <td className="px-4 md:px-6 py-3 text-sm text-foreground whitespace-nowrap">{payment.nomPayeur}</td>
                        <td className="px-4 md:px-6 py-3 text-sm text-muted-foreground whitespace-nowrap">{payment.telephone}</td>
                        <td className="px-4 md:px-6 py-3 text-sm text-right text-green-700 font-semibold whitespace-nowrap">
                          {payment.montant.toLocaleString()} XAF
                        </td>
                        <td className="px-4 md:px-6 py-3 text-sm whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${modeBadgeClass(payment.mode)}`}>
                            {modeLabel(payment.mode)}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 text-sm text-muted-foreground whitespace-nowrap">{payment.date}</td>
                        <td className="px-4 md:px-6 py-3 text-sm text-muted-foreground whitespace-nowrap">{payment.admin}</td>
                        <td className="px-4 md:px-6 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => router.push(`/admin/reservation/${payment.reservationId}`)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors text-xs font-medium"
                          >
                            <ChevronRight className="w-4 h-4" />
                            <span className="hidden sm:inline">Voir</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Aucun paiement trouvé</p>
                  </div>
                )}
              </>
            )}
          </div>

          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-border bg-secondary/20">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} paiements)
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
                  onClick={() => { if (currentPage < pagination.totalPages) setCurrentPage(currentPage + 1) }}
                  disabled={currentPage === pagination.totalPages}
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
