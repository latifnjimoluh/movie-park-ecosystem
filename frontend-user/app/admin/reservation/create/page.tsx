"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/api"

interface Pack {
  id: string
  name: string
  price: number
  description: string
  capacity: number
}

interface Participant {
  name: string
  email?: string
}

export default function CreateReservationPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [packs, setPacks] = useState<Pack[]>([])
  const [payerName, setPayerName] = useState("")
  const [payerPhone, setPayerPhone] = useState("")
  const [payerEmail, setPayerEmail] = useState("")
  const [selectedPackId, setSelectedPackId] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [participants, setParticipants] = useState<Participant[]>([{ name: "" }])

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadPacks()
    }
  }, [router])

  const loadPacks = async () => {
    try {
      const response = await fetch(`${api.baseURL}/packs?is_active=true`)
      const result = await response.json()

      if (result.status === 200) {
        const packsList = result.data.packs || result.data
        setPacks(Array.isArray(packsList) ? packsList : [])
        if (Array.isArray(packsList) && packsList.length > 0) {
          setSelectedPackId(packsList[0].id)
        }
      }
    } catch (err) {
      console.error("[v0] Error loading packs:", err)
      setError("Failed to load packs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: "" }])
  }

  const handleRemoveParticipant = (index: number) => {
    if (index > 0) {
      setParticipants(participants.filter((_, i) => i !== index))
    }
  }

  const handleUpdateParticipant = (index: number, updates: Partial<Participant>) => {
    const updated = [...participants]
    updated[index] = { ...updated[index], ...updates }
    setParticipants(updated)
  }

  const handleCreateReservation = async () => {
    // Validation
    if (!payerName || !payerPhone) {
      setError("Veuillez remplir le nom et téléphone du payeur")
      return
    }

    if (!selectedPackId) {
      setError("Veuillez sélectionner un pack")
      return
    }

    if (participants.some((p, i) => i > 0 && !p.name)) {
      setError("Veuillez remplir les noms de tous les participants")
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const reservationData = {
        payeur_name: payerName,
        payeur_phone: payerPhone,
        payeur_email: payerEmail,
        pack_id: selectedPackId,
        quantity,
        participants: participants.map((p) => ({
          name: p.name,
          email: p.email,
        })),
      }

      const response = await fetch(`${api.baseURL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })

      const result = await response.json()

      if (result.status === 201 && result.data?.reservation?.id) {
        // Redirect to reservation details
        router.push(`/admin/reservation/${result.data.reservation.id}`)
      } else {
        setError(result.message || "Failed to create reservation")
      }
    } catch (err) {
      console.error("[v0] Error creating reservation:", err)
      setError("Error creating reservation")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  const selectedPack = packs.find((p) => p.id === selectedPackId)
  const totalPrice = selectedPack ? selectedPack.price * quantity : 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-secondary rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Créer une réservation</h1>
            <p className="text-muted-foreground">Formulaire de création de réservation</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Infos du payeur */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Informations du payeur</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nom complet *</label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="237 6 70 123 456"
                    className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="jean@example.com"
                    className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Sélection du pack */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Sélection du pack</h2>
              {packs.length === 0 ? (
                <p className="text-muted-foreground">Aucun pack disponible</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {packs.map((pack) => (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedPackId === pack.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-semibold text-foreground">{pack.name}</p>
                        <p className="text-sm text-muted-foreground">{pack.price.toLocaleString()} XAF</p>
                        {pack.description && <p className="text-xs text-muted-foreground mt-1">{pack.description}</p>}
                      </button>
                    ))}
                  </div>

                  {selectedPack && (
                    <div className="bg-secondary p-4 rounded-lg">
                      <label className="block text-sm font-medium text-foreground mb-2">Quantité</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 3: Participants */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Participants</h2>
                <button
                  onClick={handleAddParticipant}
                  className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-4">{participants.length} participants</p>

              <div className="space-y-4">
                {participants.map((participant, index) => (
                  <div key={index} className="bg-secondary p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{index === 0 ? "Payeur" : `Participant ${index}`}</p>
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveParticipant(index)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) => handleUpdateParticipant(index, { name: e.target.value })}
                      placeholder="Nom complet"
                      disabled={index === 0}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                    />

                    <input
                      type="email"
                      value={participant.email || ""}
                      onChange={(e) => handleUpdateParticipant(index, { email: e.target.value })}
                      placeholder="Email (optionnel)"
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-card border border-border rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Résumé</h2>
              <div className="space-y-4">
                <div className="bg-secondary p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pack:</span>
                    <span className="font-medium text-foreground">{selectedPack?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantité:</span>
                    <span className="font-medium text-foreground">{quantity}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-foreground font-semibold">Prix total:</span>
                    <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()} XAF</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCreateReservation}
                    disabled={isSaving || !selectedPack}
                    className="w-full px-4 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Création..." : "Créer réservation"}
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="w-full px-4 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
