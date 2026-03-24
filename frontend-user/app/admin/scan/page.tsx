"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Search, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, Camera, CameraOff, Keyboard, SwitchCamera } from "lucide-react"

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

async function searchTicket(rawInput: string): Promise<TicketResult> {
  const token = localStorage.getItem("admin_token")

  // Le QR code contient un JSON signé — on en extrait le ticket_number si possible
  let ticket_number: string
  try {
    const parsed = JSON.parse(rawInput)
    ticket_number = (parsed.ticket_number as string) ?? rawInput.trim().toUpperCase()
  } catch {
    ticket_number = rawInput.trim().toUpperCase()
  }

  const res = await fetch(`${BASE_URL}/scan/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ ticket_number }),
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

type Mode = "camera" | "manual"

export default function ScanPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const scannerDivRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<any>(null)
  const processingRef = useRef(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mode, setMode] = useState<Mode>("camera")
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState("")
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([])
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null)
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

  // Démarrer scanner caméra
  const startCamera = useCallback(async (forceCameraId?: string) => {
    setCameraError("")
    if (!scannerDivRef.current) return

    try {
      const { Html5Qrcode } = await import("html5-qrcode")

      // Lister les caméras disponibles
      const cameras = await Html5Qrcode.getCameras()
      if (!cameras || cameras.length === 0) {
        throw new Error("Aucune caméra disponible sur cet appareil.")
      }

      setAvailableCameras(cameras)

      // Choisir la caméra : forcée > sélectionnée > arrière > première disponible
      let cameraId = forceCameraId ?? selectedCameraId
      if (!cameraId) {
        const backCamera = cameras.find((c) =>
          /back|rear|environment|arrière/i.test(c.label)
        )
        cameraId = backCamera?.id ?? cameras[cameras.length - 1]?.id ?? cameras[0].id
      }
      setSelectedCameraId(cameraId)

      // Arrêter le scanner précédent si actif
      if (scannerRef.current) {
        try { await scannerRef.current.stop(); scannerRef.current.clear() } catch (_) {}
        scannerRef.current = null
      }

      const scanner = new Html5Qrcode("qr-reader")
      scannerRef.current = scanner

      await scanner.start(
        cameraId,
        {
          fps: 15,
          // Boîte de scan adaptée : 80% de la plus petite dimension
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const side = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.8)
            return { width: side, height: side }
          },
        },
        async (decodedText: string) => {
          if (processingRef.current) return
          processingRef.current = true
          await stopCamera()
          await handleScanResult(decodedText)
          processingRef.current = false
        },
        () => {} // erreur frame silencieuse
      )
      setIsCameraActive(true)
    } catch (err: any) {
      const msg: string = err?.message ?? ""
      setCameraError(
        /NotAllowed|Permission|denied/i.test(msg)
          ? "Accès caméra refusé. Autorisez l'accès dans les paramètres du navigateur."
          : /NotFound|device/i.test(msg) || msg.includes("Aucune caméra")
          ? msg || "Aucune caméra détectée sur cet appareil."
          : "Impossible d'accéder à la caméra. Vérifiez les permissions."
      )
    }
  }, [selectedCameraId])

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch (_) {}
      scannerRef.current = null
    }
    setIsCameraActive(false)
  }, [])

  // Démarrer la caméra automatiquement en mode camera
  useEffect(() => {
    if (!isAuthenticated) return
    if (mode === "camera" && !result) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => { stopCamera() }
  }, [mode, isAuthenticated, result])

  const handleScanResult = async (text: string) => {
    setError("")
    setSuccess("")
    setResult(null)
    setIsSearching(true)
    try {
      const data = await searchTicket(text)
      setResult(data)
    } catch (err: any) {
      setError(err.message)
      // Reprendre le scan après erreur
      if (mode === "camera") {
        setTimeout(() => startCamera(), 2000)
      }
    } finally {
      setIsSearching(false)
    }
  }

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
    if (mode === "manual") {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const switchMode = async (newMode: Mode) => {
    await stopCamera()
    setResult(null)
    setError("")
    setSuccess("")
    setTicketNumber("")
    setMode(newMode)
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
    result?.ticket.status === "valid" ? "Valide"
    : result?.ticket.status === "used" ? "Utilisé"
    : "Annulé"

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contrôle d'entrée</h1>
          <p className="text-muted-foreground mt-1">Scannez un QR code ou saisissez le numéro manuellement</p>
        </div>

        {/* Sélecteur de mode */}
        <div className="flex gap-2 p-1 bg-secondary rounded-lg w-fit">
          <button
            onClick={() => switchMode("camera")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "camera" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Camera className="w-4 h-4" />
            Caméra
          </button>
          <button
            onClick={() => switchMode("manual")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "manual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Manuel
          </button>
        </div>

        {/* Feedback */}
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

        {/* MODE CAMÉRA */}
        {mode === "camera" && !result && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {cameraError ? (
              <div className="p-8 text-center space-y-4">
                <CameraOff className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">{cameraError}</p>
                <button
                  onClick={() => startCamera()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <div className="relative">
                <div id="qr-reader" ref={scannerDivRef} className="w-full" />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                {isCameraActive && (
                  <div className="px-4 py-3 bg-muted/50 flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">Pointez la caméra vers le QR code du ticket</p>
                    {availableCameras.length > 1 && (
                      <button
                        onClick={() => {
                          const idx = availableCameras.findIndex((c) => c.id === selectedCameraId)
                          const next = availableCameras[(idx + 1) % availableCameras.length]
                          startCamera(next.id)
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-card border border-border rounded-md text-xs font-medium hover:bg-secondary transition-colors whitespace-nowrap"
                        title="Changer de caméra"
                      >
                        <SwitchCamera className="w-3.5 h-3.5" />
                        Changer
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE MANUEL */}
        {mode === "manual" && !result && (
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
        )}

        {/* Loader pendant recherche (mode caméra) */}
        {isSearching && mode === "camera" && (
          <div className="flex items-center justify-center gap-3 p-6 bg-card border border-border rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Recherche du ticket…</p>
          </div>
        )}

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
                  <p className="font-bold text-foreground">{validated} / {total}</p>
                </div>
              </div>

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
                      p.entrance_validated ? "bg-green-50 border-green-200" : "border-border hover:border-primary/50"
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
              {mode === "camera" ? "Scanner un autre ticket" : "Nouveau ticket"}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
