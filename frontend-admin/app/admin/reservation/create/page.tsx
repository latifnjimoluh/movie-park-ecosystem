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
    const selectedPack = packs.find((p) => p.id === selectedPackId)
    if (selectedPack?.capacity && participants.length >= selectedPack.capacity) {
      setError(`Le pack "${selectedPack.name}" est limité à ${selectedPack.capacity} personnes.`)
      return
    }
    setParticipants([...participants, { name: "" }])
    setError(null)
  }

  const handlePackChange = (packId: string) => {
    setSelectedPackId(packId)
    setError(null)
    
    const pack = packs.find(p => p.id === packId)
    if (pack?.capacity) {
      // Ajuster le nombre de participants si nécessaire
      if (participants.length > pack.capacity) {
        setParticipants(participants.slice(0, pack.capacity))
      } else if (participants.length < pack.capacity && pack.name.toLowerCase().includes("couple")) {
        // Pour un pack couple, on peut pré-remplir pour avoir exactement 2
        const needed = pack.capacity - participants.length
        const extra = Array(needed).fill(null).map(() => ({ name: "" }))
        setParticipants([...participants, ...extra])
      }
    }
  }

  const handleRemoveParticipant = (index: number) => {
    if (index > 0) {
      setParticipants(participants.filter((_, i) => i !== index))
      setError(null)
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
        participants: participants.map((p, i) => ({
          name: i === 0 ? payerName : p.name,
          email: p.email,
        })),
      }

      const token = localStorage.getItem("admin_token")
      const response = await fetch(`${api.baseURL}/reservations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
                    placeholder="Anas Farid"
                    className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Téléphone *</label>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center px-3 bg-secondary border border-border rounded-md text-muted-foreground text-sm font-medium">
                      +237
                    </div>
                    <input
                      type="tel"
                      maxLength={9}
                      value={payerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 9)
                        setPayerPhone(val)
                      }}
                      placeholder="672475691"
                      className="flex-1 px-4 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  {payerPhone && payerPhone.length < 9 && (
                    <p className="text-[10px] text-orange-500 mt-1 italic">9 chiffres requis ({payerPhone.length}/9)</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="latifnjimoluh@gmail.com"
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
                        onClick={() => handlePackChange(pack.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedPackId === pack.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-foreground">{pack.name}</p>
                          {pack.capacity && (
                            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-bold uppercase">
                              {pack.capacity} pers.
                            </span>
                          )}
                        </div>
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
                      value={index === 0 ? payerName : participant.name}
                      onChange={(e) => handleUpdateParticipant(index, { name: e.target.value })}
                      placeholder="Nom complet"
                      disabled={index === 0}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                    />

                    <input
                      type="email"
                      value={participant.email || ""}
                      onChange={(e) => handleUpdateParticipant(index, { email: e.target.value })}
                      placeholder="latifnjimoluh@gmail.com"
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
