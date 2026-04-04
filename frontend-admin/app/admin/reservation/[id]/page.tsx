"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ArrowLeft, Plus, Download, Eye } from "lucide-react"
import { GenerateTicketDialog } from "@/components/admin/generate-ticket-dialog"

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog"

import { api } from "@/lib/api"

// --------------------------------------------------------------
// 🧩 INTERFACES 100 % ALIGNÉES BACKEND
// --------------------------------------------------------------
interface Participant {
  id: string
  name: string
  phone: string | null
  email: string | null
}

interface Payment {
  id: string
  amount: number
  method: string
  createdAt: string
  creator?: { name: string }
}

interface ActionLog {
  id: string
  action_type: string
  createdAt: string
  meta: any
}

interface ReservationData {
  id: string
  payeur_name: string
  payeur_phone: string
  payeur_email: string
  pack_name: string
  total_price: number
  total_paid: number
  remaining_amount: number
  status: string
  createdAt: string

  participants: Participant[]
  payments: Payment[]
  actions: ActionLog[]
}

// --------------------------------------------------------------

export default function ReservationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const reservationId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [reservation, setReservation] = useState<ReservationData | null>(null)

  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showGenerateTicket, setShowGenerateTicket] = useState(false)
  const [showAdvancementPDF, setShowAdvancementPDF] = useState(false)
  
  const [newPayment, setNewPayment] = useState({ amount: "", method: "cash", proof: null as File | null })
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)

  const mapActionDescription = (a: ActionLog) => {
    if (a.meta?.description) return a.meta.description

    if (a.action_type === "payment.add") {
      return `Paiement ajouté : +${a.meta.amount} XAF (${a.meta.method})`
    }
    if (a.action_type === "payment.delete") {
      return `Paiement supprimé : -${a.meta.amount} XAF`
    }
    if (a.action_type === "reservation.update") {
      return `Modification des informations du payeur`
    }
    if (a.action_type === "pack.change") {
      return `Changement de pack : ${a.meta.old} → ${a.meta.new}`
    }

    return a.action_type
  }

  // --------------------------------------------------------------
  // 🔐 AUTH CHECK
  // --------------------------------------------------------------
  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  // --------------------------------------------------------------
  // 📌 LOAD RESERVATION
  // --------------------------------------------------------------
  const loadReservation = async () => {
    setLoadingData(true)
    try {
      const res = await api.reservations.getOne(reservationId)

      if (!res?.reservation) {
        console.error("Réservation introuvable :", res)
        return
      }

      const r = res.reservation

      const mapped: ReservationData = {
        id: r.id,
        payeur_name: r.payeur_name,
        payeur_phone: r.payeur_phone,
        payeur_email: r.payeur_email,

        pack_name: r.pack_name_snapshot || r.pack?.name,
        total_price: r.total_price,
        total_paid: r.total_paid,
        remaining_amount: r.remaining_amount,
        status: r.status,
        createdAt: r.createdAt,

        participants: r.participants.map((p: any) => ({
          id: p.id,
          name: p.name,
          phone: p.phone,
          email: p.email,
        })),

        payments: (r.payments || []).map((p: any) => ({
          id: p.id,
          amount: p.amount,
          method: p.method,
          createdAt: p.createdAt,
          creator: p.creator,
        })),

        actions: r.actions,
      }

      setReservation(mapped)
    } catch (err) {
      console.error("Erreur récupération réservation:", err)
    }
    setLoadingData(false)
  }

  useEffect(() => {
    if (isAuthenticated) loadReservation()
  }, [isAuthenticated])

  // --------------------------------------------------------------
  // 🎨 BADGE STATUT
  // --------------------------------------------------------------
  const mapStatus = (status: string) => {
    const variants: any = {
      pending: { class: "badge-en-attente", label: "En attente" },
      partial: { class: "badge-partiel", label: "Partiel" },
      paid: { class: "badge-paye", label: "Payé" },
      ticket_generated: { class: "badge-ticket-genere", label: "Ticket généré" },
    }
    return variants[status] || { class: "badge-en-attente", label: status }
  }

  if (!isAuthenticated || !reservation) return null

  const badge = mapStatus(reservation.status)
  const montantRestant = reservation.remaining_amount
  const isSolded = montantRestant <= 0

  // --------------------------------------------------------------
  // 💵 AJOUTER UN PAIEMENT
  // --------------------------------------------------------------
  const handleAddPayment = async () => {
    if (!newPayment.amount) return
    
    setPaymentError(null)
    setIsSubmittingPayment(true)

    try {
      const formData = new FormData()
      formData.append("amount", newPayment.amount)
      formData.append("method", newPayment.method)
      if (newPayment.proof) {
        formData.append("proof", newPayment.proof)
      }

      const token = localStorage.getItem("admin_token")
      const response = await fetch(`${api.baseURL}/reservations/${reservationId}/payments`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout du paiement")
      }

      await loadReservation()
      setShowAddPayment(false)
      setNewPayment({ amount: "", method: "cash", proof: null })
    } catch (err: any) {
      console.error("Erreur ajout paiement :", err)
      setPaymentError(err.message || "Une erreur est survenue lors du paiement")
    } finally {
      setIsSubmittingPayment(false)
    }
  }

  const handleGenerateTicket = () => {
    setShowGenerateTicket(true)
  }

  const renderPaymentSummary = () => {
    if (!reservation) return null
    const montantRestant = reservation.remaining_amount
    const isSolded = montantRestant <= 0

    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Résumé paiement</h2>
          {isSolded && (
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Soldé</span>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground text-sm">Total payé</p>
            <p className="text-2xl font-bold text-green-600">
              {reservation.total_paid} XAF
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm">Montant restant</p>
            <p className="text-2xl font-bold text-orange-600">{montantRestant} XAF</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {montantRestant > 0 && (
            <button
              onClick={() => setShowAdvancementPDF(true)}
              className="w-full flex items-center justify-center bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Bon d'avancement
            </button>
          )}

          {isSolded && reservation.status !== "ticket_generated" && (
            <button
              onClick={handleGenerateTicket}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Générer ticket
            </button>
          )}

          {!isSolded && reservation.status !== "ticket_generated" && (
            <div className="text-center p-2 bg-secondary/30 rounded-md">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Le paiement doit être complet pour générer le ticket</p>
            </div>
          )}

          {reservation.status === "ticket_generated" && (
            <button
              onClick={handleGenerateTicket}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              <Eye className="w-4 h-4" />
              Visualiser le ticket
            </button>
          )}
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------
  // 🚀 UI PAGE PRINCIPALE
  // --------------------------------------------------------------

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-secondary rounded-md">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-3xl font-bold">Détails de la réservation</h1>
            <p className="text-muted-foreground">ID : {reservation.id}</p>
          </div>
        </div>

        {/* CONTENU */}
        {loadingData ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-6">
              {/* PAYEUR */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Informations du payeur</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nom</p>
                    <p className="font-medium">{reservation.payeur_name}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{reservation.payeur_phone}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{reservation.payeur_email}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Pack</p>
                    <p className="font-medium">{reservation.pack_name}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Prix total</p>
                    <p className="font-medium">{reservation.total_price.toLocaleString()} XAF</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Statut</p>
                    <span className={`badge ${badge.class}`}>{badge.label}</span>
                  </div>
                </div>
              </div>

              {/* PARTICIPANTS */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Participants</h2>

                <div className="space-y-3">
                  {reservation.participants.map((p) => (
                    <div key={p.id} className="p-3 bg-secondary rounded-md">
                      <p className="font-medium">{p.name}</p>
                      {p.email && <p className="text-xs text-muted-foreground">{p.email}</p>}
                      {p.phone && <p className="text-xs text-muted-foreground">{p.phone}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENTS */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Paiements</h2>

                  <button
                    onClick={() => setShowAddPayment(true)}
                    disabled={isSolded}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      isSolded 
                        ? "bg-secondary text-muted-foreground cursor-not-allowed opacity-70" 
                        : "bg-primary text-primary-foreground hover:bg-accent"
                    }`}
                  >
                    <Plus className="w-4 h-4" /> 
                    {isSolded ? "Soldé" : "Ajouter"}
                  </button>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Montant</th>
                      <th className="text-left">Méthode</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Admin</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reservation.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="font-medium">{p.amount.toLocaleString()} XAF</td>
                        <td>{p.method}</td>
                        <td>{new Date(p.createdAt).toLocaleDateString("fr-FR")}</td>
                        <td>{p.creator?.name || "Administrateur"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ACTION LOGS */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Historique des actions</h2>

                <div className="space-y-3">
                  {reservation.actions.map((a) => (
                    <div key={a.id} className="p-3 bg-secondary rounded-md text-sm">
                      <p className="font-medium">{mapActionDescription(a)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString("fr-FR")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="space-y-6">{renderPaymentSummary()}</div>
          </div>
        )}
      </div>

      {reservation && (
        <GenerateTicketDialog
          open={showGenerateTicket}
          onOpenChange={setShowGenerateTicket}
          reservationId={reservation.id}
          packName={reservation.pack_name}
          mode={reservation.status === "ticket_generated" ? "view" : "generate"}
          onSuccess={() => {
            loadReservation()
          }}
        />
      )}

      {/* AJOUT PAIEMENT */}
      <Dialog open={showAddPayment} onOpenChange={(open) => {
        if (!open) {
          setPaymentError(null)
          setNewPayment({ amount: "", method: "cash", proof: null })
        }
        setShowAddPayment(open)
      }}>
        <DialogContent className="bg-card border rounded-lg max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un paiement</DialogTitle>
            <DialogDescription>
              Enregistrez un nouveau versement pour cette réservation. Une preuve est requise pour Mobile Money.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {paymentError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-medium">
                {paymentError}
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1.5 block">Montant (XAF)</label>
              <input
                type="number"
                min="0"
                value={newPayment.amount}
                onChange={(e) => {
                  const val = e.target.value
                  if (Number(val) < 0) return
                  setNewPayment({ ...newPayment, amount: val })
                }}
                placeholder={`Max: ${montantRestant}`}
                className="w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Méthode</label>
              <select
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value, proof: null })}
                className="w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="cash">Espèces (Cash)</option>
                <option value="momo">MTN Mobile Money</option>
                <option value="orange">Orange Money</option>
              </select>
            </div>

            {(newPayment.method === "momo" || newPayment.method === "orange") && (
              <div className="space-y-2 p-3 bg-secondary/50 rounded-lg border border-dashed border-border">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Preuve de paiement (Obligatoire)
                </label>
                <p className="text-[10px] text-muted-foreground mb-2">Capture d'écran du transfert ou reçu PDF</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setNewPayment({ ...newPayment, proof: file })
                  }}
                  className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {newPayment.proof && (
                  <p className="text-[10px] text-green-600 font-medium">Fichier sélectionné : {newPayment.proof.name}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <button 
              onClick={() => setShowAddPayment(false)} 
              disabled={isSubmittingPayment}
              className="px-4 py-2 bg-secondary rounded-md text-sm font-medium hover:bg-secondary/80 disabled:opacity-50"
            >
              Annuler
            </button>

            <button 
              onClick={handleAddPayment} 
              disabled={isSubmittingPayment || !newPayment.amount || ((newPayment.method === "momo" || newPayment.method === "orange") && !newPayment.proof)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmittingPayment ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : "Enregistrer le paiement"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
