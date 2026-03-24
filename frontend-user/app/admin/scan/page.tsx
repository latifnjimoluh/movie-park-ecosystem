"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Search, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api"

interface Participant {
  id: string
  name: string
  phone: string
  entrance_validated: boolean
  ticket_id: string | null
}

interface TicketResult {
  ticket: {
    id: string
    ticket_number: string
    status: "valid" | "used" | "cancelled"
    reservation_id: string
  }
  reservation: {
    id: string
    payeur_name: string
    payeur_phone: string
    pack_name_snapshot: string
    quantity: number
    participants: Participant[]
  }
}

async function searchTicket(ticket_number: string): Promise<TicketResult> {
  const token = localStorage.getItem("admin_token")
  const res = await fetch(`${BASE_URL}/scan/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ ticket_number: ticket_number.trim().toUpperCase() }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Ticket introuvable")
  return json.data as TicketResult
}

async function validateParticipant(ticket_number: string, participant_id: string): Promise<void> {
  const token = localStorage.getItem("admin_token")
  const res = await fetch(`${BASE_URL}/scan/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ ticket_number, participant_id }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Validation échouée")
}

export default function ScanPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")
  const [result, setResult] = useState<TicketResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [validatingId, setValidatingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000)
      return () => clearTimeout(t)
    }
  }, [success])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketNumber.trim()) return
    setError("")
    setSuccess("")
    setResult(null)
    setIsSearching(true)
    try {
      const data = await searchTicket(ticketNumber)
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSearching(false)
    }
  }

  const handleValidate = async (participant: Participant) => {
    if (!result) return
    if (participant.entrance_validated) {
      setError(`${participant.name} a déjà été validé(e)`)
      return
    }
    if (result.ticket.status !== "valid") {
      setError("Ce ticket n'est plus valide")
      return
    }
    setError("")
    setValidatingId(participant.id)
    try {
      await validateParticipant(result.ticket.ticket_number, participant.id)
      // Refresh ticket data
      const updated = await searchTicket(result.ticket.ticket_number)
      setResult(updated)
      setSuccess(`✅ ${participant.name} — entrée validée`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setValidatingId(null)
    }
  }

  const handleReset = () => {
    setResult(null)
    setTicketNumber("")
    setError("")
    setSuccess("")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  if (!isAuthenticated) return null

  const participants = result?.reservation?.participants ?? []
  const validated = participants.filter((p) => p.entrance_validated).length
  const total = participants.length

  const statusColor =
    result?.ticket.status === "valid"
      ? "bg-green-100 text-green-800 border-green-300"
      : result?.ticket.status === "used"
        ? "bg-blue-100 text-blue-800 border-blue-300"
        : "bg-red-100 text-red-800 border-red-300"

  const statusLabel =
    result?.ticket.status === "valid"
      ? "Valide"
      : result?.ticket.status === "used"
        ? "Utilisé"
        : "Annulé"

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contrôle d'entrée</h1>
          <p className="text-muted-foreground mt-1">
            Saisissez un numéro de ticket ou scannez le QR code (clavier physique)
          </p>
        </div>

        {/* Bandeaux de feedback */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm font-medium">{success}</p>
          </div>
        )}

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="MIP-XXXXXXXX-YYYYYY"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground font-mono placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !ticketNumber.trim()}
            className="px-5 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isSearching ? "Recherche…" : "Chercher"}
          </button>
        </form>

        {/* Résultat */}
        {result && (
          <div className="space-y-4">
            {/* Carte ticket */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Numéro de ticket</p>
                  <p className="text-lg font-mono font-bold text-foreground">{result.ticket.ticket_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border text-sm">
                <div>
                  <p className="text-muted-foreground mb-0.5">Payeur</p>
                  <p className="font-medium text-foreground">{result.reservation.payeur_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Pack</p>
                  <p className="font-medium text-foreground">{result.reservation.pack_name_snapshot}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Présences</p>
                  <p className="font-bold text-foreground">
                    {validated} / {total}
                  </p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: total > 0 ? `${(validated / total) * 100}%` : "0%" }}
                />
              </div>
            </div>

            {/* Liste participants */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Participants ({validated}/{total} validés)
              </h2>
              <div className="space-y-2">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      p.entrance_validated
                        ? "bg-green-50 border-green-200"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {p.entrance_validated ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.entrance_validated ? "Entrée validée" : "En attente"}
                        </p>
                      </div>
                    </div>

                    {!p.entrance_validated && result.ticket.status === "valid" && (
                      <button
                        onClick={() => handleValidate(p)}
                        disabled={validatingId === p.id}
                        className="px-3 py-1.5 bg-primary hover:bg-accent text-primary-foreground rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {validatingId === p.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        Valider
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Scanner un autre ticket
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
