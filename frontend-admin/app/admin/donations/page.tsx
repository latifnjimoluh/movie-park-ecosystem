"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import {
  Heart,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Upload,
  X,
  ImageIcon,
} from "lucide-react"
import { api } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Donation {
  id: string
  donor_name: string | null
  email: string | null
  amount: number
  payment_status: "pending" | "completed" | "failed"
  transaction_id: string | null
  proof_url: string | null
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  donations: Donation[]
  total_collected: number
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 15

const STATUS_CONFIG = {
  completed: {
    label: "Confirmé",
    icon: CheckCircle2,
    className: "bg-green-500/15 text-green-400 border border-green-500/30",
  },
  pending: {
    label: "En attente",
    icon: Clock,
    className: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  },
  failed: {
    label: "Échoué",
    icon: XCircle,
    className: "bg-red-500/15 text-red-400 border border-red-500/30",
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatXAF(n: number) {
  return n.toLocaleString("fr-FR") + " XAF"
}

function statusLabel(s: Donation["payment_status"]) {
  return STATUS_CONFIG[s]?.label ?? s
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Export CSV avec BOM UTF-8 (compatible Excel) */
function exportCSV(rows: Donation[]) {
  const headers = ["Nom donateur", "Email", "Montant (XAF)", "Statut", "ID transaction", "Date"]
  const lines = rows.map((d) => [
    d.donor_name ?? "Anonyme",
    d.email ?? "—",
    d.amount.toString(),
    statusLabel(d.payment_status),
    d.transaction_id ?? "—",
    formatDate(d.createdAt),
  ])

  const csvContent =
    "\uFEFF" +
    [headers, ...lines]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")
      )
      .join("\r\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  triggerDownload(blob, `donateurs_mitp_${todayStr()}.csv`)
}

/** Export XLSX via SheetJS */
async function exportXLSX(rows: Donation[], totalCollected: number) {
  const XLSX = await import("xlsx")

  const data = [
    ["Nom donateur", "Email", "Montant (XAF)", "Statut", "ID transaction", "Date"],
    ...rows.map((d) => [
      d.donor_name ?? "Anonyme",
      d.email ?? "—",
      d.amount,
      statusLabel(d.payment_status),
      d.transaction_id ?? "—",
      formatDate(d.createdAt),
    ]),
    [],
    ["", "", "", "", "Total collecté (confirmés) :", totalCollected],
  ]

  const ws = XLSX.utils.aoa_to_sheet(data)
  ws["!cols"] = [
    { wch: 28 },
    { wch: 32 },
    { wch: 16 },
    { wch: 14 },
    { wch: 38 },
    { wch: 20 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Donateurs")
  XLSX.writeFile(wb, `donateurs_mitp_${todayStr()}.xlsx`)
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function DonationsPage() {
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [donations, setDonations]             = useState<Donation[]>([])
  const [totalCollected, setTotalCollected]   = useState(0)
  const [isLoading, setIsLoading]             = useState(true)
  const [error, setError]                     = useState<string | null>(null)
  const [search, setSearch]                   = useState("")
  const [statusFilter, setStatusFilter]       = useState<"all" | Donation["payment_status"]>("all")
  const [currentPage, setCurrentPage]         = useState(1)

  // Confirm modal
  const [confirmTarget, setConfirmTarget]   = useState<Donation | null>(null)
  const [txInput, setTxInput]               = useState("")
  const [proofFile, setProofFile]           = useState<File | null>(null)
  const [proofPreview, setProofPreview]     = useState<string | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [rejectLoading, setRejectLoading]   = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) router.push("/admin/login")
    else setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    if (isAuthenticated) loadDonations()
  }, [isAuthenticated])

  const loadDonations = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const res: ApiResponse = await api.donations.getAll()
      setDonations(res.donations ?? [])
      setTotalCollected(res.total_collected ?? 0)
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des dons")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Filtrage / recherche ──────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return donations.filter((d) => {
      const matchStatus = statusFilter === "all" || d.payment_status === statusFilter
      const matchSearch =
        !q ||
        (d.donor_name ?? "").toLowerCase().includes(q) ||
        (d.email ?? "").toLowerCase().includes(q) ||
        (d.transaction_id ?? "").toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [donations, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => setCurrentPage(1), [search, statusFilter])

  // ── Statistiques rapides ──────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total:     donations.length,
    completed: donations.filter((d) => d.payment_status === "completed").length,
    pending:   donations.filter((d) => d.payment_status === "pending").length,
    failed:    donations.filter((d) => d.payment_status === "failed").length,
  }), [donations])

  // ── Gestion fichier preuve ────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProofFile(file)
    if (file.type.startsWith("image/")) {
      setProofPreview(URL.createObjectURL(file))
    } else {
      setProofPreview(null)
    }
  }

  const clearFile = () => {
    setProofFile(null)
    setProofPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const openConfirmModal = (d: Donation) => {
    setConfirmTarget(d)
    setTxInput("")
    clearFile()
  }

  const closeConfirmModal = () => {
    setConfirmTarget(null)
    setTxInput("")
    clearFile()
  }

  // ── Actions statut ────────────────────────────────────────────────────────

  const handleConfirm = async () => {
    if (!confirmTarget) return
    setConfirmLoading(true)
    try {
      let proof_url: string | undefined

      if (proofFile) {
        const result = await api.donations.uploadProof(confirmTarget.id, proofFile)
        proof_url = result.proof_url
      }

      await api.donations.confirm(confirmTarget.id, txInput || undefined, proof_url)
      await loadDonations()
      closeConfirmModal()
    } catch (err: any) {
      alert("Erreur : " + err.message)
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleFail = async (id: string) => {
    if (!confirm("Marquer ce don comme échoué ?")) return
    setRejectLoading(id)
    try {
      await api.donations.fail(id)
      await loadDonations()
    } catch (err: any) {
      alert("Erreur : " + err.message)
    } finally {
      setRejectLoading(null)
    }
  }

  if (!isAuthenticated) return null

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── En-tête ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-500" />
              Donateurs
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gestion des dons — Édition Spéciale Orphelins 2026
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadDonations}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-border"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualiser
            </button>

            <button
              onClick={() => exportCSV(filtered)}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-border disabled:opacity-40"
            >
              <FileText className="w-4 h-4 text-green-500" />
              CSV
            </button>

            <button
              onClick={() => exportXLSX(filtered, totalCollected)}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-border disabled:opacity-40"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              Excel
            </button>
          </div>
        </div>

        {/* ── Statistiques ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total dons" value={stats.total} icon={<Heart className="w-5 h-5 text-pink-400" />} color="pink" />
          <StatCard label="Confirmés" value={stats.completed} icon={<CheckCircle2 className="w-5 h-5 text-green-400" />} color="green" sub={formatXAF(totalCollected)} />
          <StatCard label="En attente" value={stats.pending} icon={<Clock className="w-5 h-5 text-yellow-400" />} color="yellow" />
          <StatCard label="Échoués" value={stats.failed} icon={<XCircle className="w-5 h-5 text-red-400" />} color="red" />
        </div>

        {/* ── Total collecté banner ─────────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/25">
          <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-green-400/70 uppercase tracking-wider font-semibold">Total collecté (dons confirmés)</p>
            <p className="text-2xl font-black text-green-400">{formatXAF(totalCollected)}</p>
          </div>
        </div>

        {/* ── Filtres ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, ID transaction…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["all", "completed", "pending", "failed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {s === "all" ? "Tous" : STATUS_CONFIG[s].label}
                {s !== "all" && (
                  <span className="ml-1 opacity-60">
                    ({s === "completed" ? stats.completed : s === "pending" ? stats.pending : stats.failed})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── État erreur / chargement ──────────────────────────────────────── */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Chargement des dons…
          </div>
        )}

        {/* ── Tableau ──────────────────────────────────────────────────────── */}
        {!isLoading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                Aucun don trouvé.
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Donateur</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Montant</th>
                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Statut</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">ID transaction</th>
                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Preuve</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Date</th>
                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginated.map((d) => {
                        const cfg = STATUS_CONFIG[d.payment_status]
                        const StatusIcon = cfg.icon
                        const isPending = d.payment_status === "pending"
                        const proofFullUrl = d.proof_url
                          ? `${api.baseURL.replace(/\/api$/, "")}${d.proof_url}`
                          : null
                        return (
                          <tr key={d.id} className="bg-card hover:bg-muted/30 transition-colors">

                            {/* Nom */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/25 flex items-center justify-center flex-shrink-0">
                                  <span className="text-pink-400 text-xs font-bold">
                                    {(d.donor_name ?? "A").charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-medium text-foreground">
                                  {d.donor_name ?? <span className="italic text-muted-foreground">Anonyme</span>}
                                </span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-4 py-3 text-muted-foreground">
                              {d.email ?? <span className="italic">—</span>}
                            </td>

                            {/* Montant */}
                            <td className="px-4 py-3 text-right font-bold text-foreground">
                              {formatXAF(d.amount)}
                            </td>

                            {/* Statut */}
                            <td className="px-4 py-3">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {cfg.label}
                                </span>
                              </div>
                            </td>

                            {/* Transaction ID */}
                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden lg:table-cell">
                              {d.transaction_id
                                ? <span title={d.transaction_id}>{d.transaction_id.slice(0, 20)}{d.transaction_id.length > 20 ? "…" : ""}</span>
                                : <span className="italic">—</span>
                              }
                            </td>

                            {/* Preuve */}
                            <td className="px-4 py-3 text-center hidden md:table-cell">
                              {proofFullUrl ? (
                                <a
                                  href={proofFullUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-lg hover:bg-blue-500/25 transition-colors"
                                >
                                  <ImageIcon className="w-3 h-3" />
                                  Voir
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">—</span>
                              )}
                            </td>

                            {/* Date */}
                            <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell whitespace-nowrap">
                              {formatDate(d.createdAt)}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              {isPending ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => openConfirmModal(d)}
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Confirmer
                                  </button>
                                  <button
                                    onClick={() => handleFail(d.id)}
                                    disabled={rejectLoading === d.id}
                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold rounded bg-red-600/80 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    {rejectLoading === d.id ? "…" : "Rejeter"}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic px-2">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Pagination ──────────────────────────────────────────────── */}
            {filtered.length > PAGE_SIZE && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {filtered.length} don{filtered.length > 1 ? "s" : ""} —
                  page {currentPage} / {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-secondary border border-border hover:bg-muted transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-secondary border border-border hover:bg-muted transition-colors disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal de confirmation ───────────────────────────────────────────── */}
      <Dialog open={!!confirmTarget} onOpenChange={(open) => !open && closeConfirmModal()}>
        <DialogContent className="bg-card border-border sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              Confirmer le don
            </DialogTitle>
          </DialogHeader>

          {confirmTarget && (
            <div className="space-y-4 py-2">
              {/* Résumé du don */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="w-10 h-10 rounded-full bg-pink-500/15 border border-pink-500/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-400 text-sm font-bold">
                    {(confirmTarget.donor_name ?? "A").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {confirmTarget.donor_name ?? <span className="italic text-muted-foreground">Anonyme</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{confirmTarget.email ?? "—"}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-black text-green-400">{formatXAF(confirmTarget.amount)}</p>
                </div>
              </div>

              {/* ID Transaction */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  ID Transaction (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="ex: MP2025-XXXXXXXX"
                  value={txInput}
                  onChange={(e) => setTxInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/40"
                />
              </div>

              {/* Upload preuve */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Preuve de paiement (optionnel)
                </label>

                {!proofFile ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-xs text-center">
                      Cliquez pour uploader un screenshot<br />
                      <span className="text-muted-foreground/60">JPG, PNG ou PDF — max 5 Mo</span>
                    </span>
                  </button>
                ) : (
                  <div className="relative rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-destructive/20 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {proofPreview ? (
                      <img
                        src={proofPreview}
                        alt="Aperçu preuve"
                        className="max-h-40 mx-auto rounded object-contain"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="truncate">{proofFile.name}</span>
                      </div>
                    )}
                    <p className="text-xs text-green-400 mt-2 text-center">
                      Fichier sélectionné — {(proofFile.size / 1024).toFixed(0)} Ko
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <button
              onClick={closeConfirmModal}
              disabled={confirmLoading}
              className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirmLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {confirmLoading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Traitement…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Confirmer le don</>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

// ─── Composant stat card ──────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: "pink" | "green" | "yellow" | "red"
  sub?: string
}) {
  const colorMap = {
    pink:   "bg-pink-500/10 border-pink-500/20",
    green:  "bg-green-500/10 border-green-500/20",
    yellow: "bg-yellow-500/10 border-yellow-500/20",
    red:    "bg-red-500/10 border-red-500/20",
  }
  return (
    <div className={`rounded-xl p-4 border ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-muted-foreground font-medium">{label}</span></div>
      <p className="text-3xl font-black text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}
