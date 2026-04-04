"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PaymentInstructions from "@/components/payment-instructions"
import ConfirmationModal from "@/components/confirmation-modal"
import { createReservation } from "@/lib/reservation-service"
import { ChevronLeft } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import type { BackendPack } from "@/lib/types"

export default function ReservationSummaryPage() {
  const router       = useRouter()
  const { language } = useTheme()

  const [reservation, setReservation] = useState<any>(null)
  const [isLoading, setIsLoading]     = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [showModal, setShowModal]     = useState(true)
  const hasCreatedReservation         = useRef(false)

  useEffect(() => {
    if (hasCreatedReservation.current) return

    const createReservationFromStorage = async () => {
      try {
        setIsLoading(true)
        const formDataStr = sessionStorage.getItem("reservationFormData")
        const packDataStr = sessionStorage.getItem("selectedPack")

        if (!formDataStr || !packDataStr) { router.push("/reservation"); return }

        const { formData, participants } = JSON.parse(formDataStr)
        const selectedPack: BackendPack  = JSON.parse(packDataStr)

        hasCreatedReservation.current = true

        const newReservation = await createReservation(
          selectedPack.id, formData.nom, formData.prenom,
          formData.telephone, formData.email, participants, formData.howDidYouKnow,
        )

        setReservation({
          id: newReservation.id, nom: newReservation.nom,
          telephone: newReservation.telephone, email: newReservation.email,
          packName: newReservation.packName, participants: newReservation.participants ?? [],
          totalPrice: newReservation.totalPrice, amountPaid: newReservation.amountPaid ?? 0,
          remainingAmount: newReservation.remainingAmount ?? 0,
          status: newReservation.status ?? "pending",
          createdAt: newReservation.createdAt, updatedAt: newReservation.updatedAt,
        })

        sessionStorage.removeItem("reservationFormData")
        sessionStorage.removeItem("selectedPack")
      } catch (err) {
        console.error("❌ [Summary] Erreur création réservation:", err)
        hasCreatedReservation.current = false
        setError("Une erreur est survenue lors de la création de votre réservation.")
      } finally {
        setIsLoading(false)
      }
    }

    createReservationFromStorage()
  }, [router])

  const handleBackToReservation = () => {
    sessionStorage.removeItem("reservationFormData")
    sessionStorage.removeItem("selectedPack")
    hasCreatedReservation.current = false
    router.push("/reservation")
  }

  if (isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center page-section">
        <div className="text-center">
          <div className="reservation-spinner w-12 h-12 rounded-full border-4 animate-spin mx-auto mb-4" />
          <p className="films-desc">Création de votre réservation...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center page-section">
        <div className="max-w-md mx-auto p-6">
          <div className="reservation-error rounded-lg p-6 mb-4">{error}</div>
          <button type="button" onClick={handleBackToReservation}
            className="w-full header-cta-btn py-3 rounded-lg font-semibold">
            Retour aux réservations
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full">
      <Header />

      {reservation && (
        <ConfirmationModal isOpen={showModal} onClose={() => setShowModal(false)} reservation={reservation} />
      )}

      <section className="page-hero pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            ✅ Confirmation
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Confirmation de réservation</h1>
          <p className="films-desc text-sm md:text-lg">Votre réservation a été créée avec succès</p>
        </div>
      </section>

      <section className="page-section py-12 md:py-20 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <button type="button" onClick={handleBackToReservation}
            className="reservation-back flex items-center gap-2 font-semibold text-sm mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            {t("reservationPage.confirmationBack", language)}
          </button>
          {reservation && <PaymentInstructions reservation={reservation} />}
        </div>
      </section>

      <Footer />
    </main>
  )
}
