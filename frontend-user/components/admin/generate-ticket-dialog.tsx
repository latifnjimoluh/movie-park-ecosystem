"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Download, Eye } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api"

interface GenerateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservationId: string
  packName: string
  /** Passer "view" quand le ticket est déjà généré — saute l'étape de confirmation */
  mode?: "generate" | "view"
  onSuccess?: () => void
}

interface TicketData {
  id: string
  ticket_number: string
  qr_data_url: string
  qr_image_url?: string
  pdf_url?: string
  status: string
  generated_at: string
}

export function GenerateTicketDialog({
  open,
  onOpenChange,
  reservationId,
  packName,
  mode = "generate",
  onSuccess,
}: GenerateTicketDialogProps) {
  const [step, setStep] = useState<"confirm" | "generating" | "preview" | "error">("confirm")
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [isExistingTicket, setIsExistingTicket] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const [showPdfPreview, setShowPdfPreview] = useState(false)

  // En mode "view", déclencher automatiquement la récupération du ticket
  useEffect(() => {
    if (open && mode === "view" && step === "confirm") {
      handleGenerate()
    }
  }, [open, mode])

  // Réinitialiser quand le dialog se ferme
  useEffect(() => {
    if (!open) {
      setStep("confirm")
      setTicketData(null)
      setIsExistingTicket(false)
      setError(null)
      setPdfUrl(null)
      setShowPdfPreview(false)
    }
  }, [open])

  const handleGenerate = async () => {
    setStep("generating")
    setError(null)

    try {
      const response = (await api.tickets.generate(reservationId)) as any

      const ticket: TicketData = response.ticket
      if (!ticket) throw new Error("Réponse invalide du serveur")

      // Détecter si c'est un ticket existant (pas de "reservation" dans la réponse)
      const alreadyExisted = !response.reservation
      setIsExistingTicket(alreadyExisted)
      setTicketData(ticket)

      if (ticket.pdf_url) {
        const backendBase = BASE_URL.replace("/api", "")
        setPdfUrl(
          ticket.pdf_url.startsWith("http")
            ? ticket.pdf_url
            : `${backendBase}${ticket.pdf_url}`
        )
      }

      setStep("preview")
      if (!alreadyExisted) onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la génération du ticket")
      setStep("error")
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleOpenPdf = () => {
    if (pdfUrl) window.open(pdfUrl, "_blank")
  }

  const handleDownloadPdf = () => {
    if (!pdfUrl || !ticketData) return
    setIsDownloading(true)
    
    try {
      const token = localStorage.getItem("admin_token")
      
      // ✅ Créer une URL de téléchargement directe avec le token en query param
      // Le backend doit pouvoir accepter le token via query param si Authorization header manque
      const directDownloadUrl = `${BASE_URL}/tickets/${ticketData.id}/download?token=${token || ""}`
      
      console.log("[DownloadPDF] Triggering direct download:", directDownloadUrl)
      
      const link = document.createElement("a")
      link.href = directDownloadUrl
      link.setAttribute("download", `ticket-${ticketData.ticket_number}.pdf`)
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Simuler un petit délai pour l'état de chargement
      setTimeout(() => setIsDownloading(false), 1000)
    } catch (err) {
      console.error("[DownloadPDF] Direct download trigger failed:", err)
      window.open(pdfUrl, "_blank")
      setIsDownloading(false)
    }
  }

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === "confirm" && (mode === "view" ? "Visualiser le ticket" : "Générer le ticket")}
            {step === "generating" && (mode === "view" ? "Chargement du ticket…" : "Génération en cours…")}
            {step === "preview" && (isExistingTicket ? "Ticket existant" : "Ticket généré avec succès")}
            {step === "error" && "Échec de la génération"}
          </DialogTitle>
          <DialogDescription>
            {step === "confirm" && "Cette action créera un ticket avec un QR code unique pour cette réservation. Le ticket sera marqué comme généré dans le système."}
            {step === "generating" && (mode === "view" ? "Récupération du ticket en cours…" : "Veuillez patienter pendant la génération de votre ticket…")}
            {step === "preview" && (isExistingTicket ? "Un ticket a déjà été généré pour cette réservation." : "Votre ticket est prêt. Téléchargez ou partagez le PDF.")}
            {step === "error" && "Une erreur est survenue. Veuillez réessayer."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {/* Étape confirmation */}
          {step === "confirm" && (
            <p className="text-sm text-muted-foreground">
              Cette action créera un ticket avec un QR code unique pour cette réservation.
              Le ticket sera marqué comme généré dans le système.
            </p>
          )}

          {/* Étape génération */}
          {step === "generating" && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
              <span className="ml-3 text-muted-foreground">
                {mode === "view" ? "Récupération du ticket…" : "Génération du ticket…"}
              </span>
            </div>
          )}

          {/* Étape aperçu */}
          {step === "preview" && ticketData && (
            <div className="space-y-4">
              {isExistingTicket ? (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Ticket <strong>{ticketData.ticket_number}</strong> — déjà généré.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    Ticket <strong>{ticketData.ticket_number}</strong> généré avec succès !
                  </p>
                </div>
              )}

              {/* Aperçu Réel du PDF */}
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-slate-50 relative min-h-[220px] flex items-center justify-center">
                {!showPdfPreview ? (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Aperçu PDF sécurisé</p>
                    <p className="text-xs text-slate-500 mb-4">Cliquez pour charger l'aperçu du ticket sans le télécharger</p>
                    <Button size="sm" onClick={() => setShowPdfPreview(true)} className="gap-2">
                      <Eye className="w-4 h-4" />
                      Afficher l'aperçu
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-[520px]">
                    <iframe
                      src={`${BASE_URL}/tickets/${ticketData.id}/preview?token=${typeof window !== "undefined" ? localStorage.getItem("admin_token") : ""}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full block"
                      title="Ticket Real Preview"
                      type="application/pdf"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Étape erreur */}
          {step === "error" && error && (
            <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Échec de la génération</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step === "confirm" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={handleGenerate}>Générer le ticket</Button>
            </>
          )}

          {step === "preview" && (
            <>
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Téléchargement…" : "Télécharger PDF"}
              </Button>
              <Button onClick={handleClose}>Terminer</Button>
            </>
          )}

          {step === "error" && (
            <>
              <Button variant="outline" onClick={() => setStep("confirm")}>
                Retour
              </Button>
              <Button onClick={handleGenerate}>Réessayer</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
