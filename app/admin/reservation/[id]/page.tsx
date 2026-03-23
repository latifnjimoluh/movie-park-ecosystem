"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ArrowLeft, Plus, Download } from "lucide-react"
import { GenerateTicketDialog } from "@/components/admin/generate-ticket-dialog"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

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
  const [newPayment, setNewPayment] = useState({ amount: "", method: "cash" })

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
  const totalPayé = reservation.total_paid
  const montantRestant = reservation.remaining_amount

  // --------------------------------------------------------------
  // 💵 AJOUTER UN PAIEMENT
  // --------------------------------------------------------------
  const handleAddPayment = async () => {
    if (!newPayment.amount) return

    try {
      await api.payments.add(reservation.id, {
        amount: Number(newPayment.amount),
        method: newPayment.method,
      })

      await loadReservation()
      setShowAddPayment(false)
      setNewPayment({ amount: "", method: "cash" })
    } catch (err) {
      console.error("Erreur ajout paiement :", err)
    }
  }

  const handleGenerateTicket = () => {
    setShowGenerateTicket(true)
  }

  const renderPaymentSummary = () => {
    if (!reservation) return null
    const montantRestant = reservation.remaining_amount

    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Résumé paiement</h2>

        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground text-sm">Total payé</p>
            <p className="text-2xl font-bold text-green-600">
              {montantRestant > 0 ? reservation.total_paid : reservation.total_price} XAF
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

          {montantRestant === 0 && (
            <button
              onClick={handleGenerateTicket}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Générer ticket
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
                    className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md"
                  >
                    <Plus className="w-4 h-4" /> Ajouter
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
                        <td>{p.creator?.name || "Admin"}</td>
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
          onSuccess={() => {
            loadReservation()
          }}
        />
      )}

      {/* AJOUT PAIEMENT */}
      <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
        <DialogContent className="bg-card border rounded-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un paiement</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm">Montant</label>
              <input
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                className="w-full px-3 py-2 bg-input border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm">Méthode</label>
              <select
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                className="w-full px-3 py-2 bg-input border rounded-md"
              >
                <option value="cash">Cash</option>
                <option value="momo">Mobile Money</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <button onClick={() => setShowAddPayment(false)} className="px-4 py-2 bg-secondary rounded-md">
              Annuler
            </button>

            <button onClick={handleAddPayment} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Ajouter
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
