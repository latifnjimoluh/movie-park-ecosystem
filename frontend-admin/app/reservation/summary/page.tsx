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
  const router = useRouter()
  const { language } = useTheme()

  const [reservation, setReservation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(true)

  // ✅ SOLUTION: Utiliser useRef pour empêcher les doubles appels
  const hasCreatedReservation = useRef(false)

  useEffect(() => {
    // ✅ Si la réservation a déjà été créée, ne rien faire
    if (hasCreatedReservation.current) {
      console.log("⚠️ Reservation already created, skipping...")
      return
    }

    const createReservationFromStorage = async () => {
      try {
        console.log("🔵 Starting reservation creation...")
        setIsLoading(true)

        // Récupérer les données depuis sessionStorage
        const formDataStr = sessionStorage.getItem("reservationFormData")
        const packDataStr = sessionStorage.getItem("selectedPack")

        if (!formDataStr || !packDataStr) {
          console.warn("Données manquantes, redirection...")
          router.push("/reservation")
          return
        }

        const { formData, participants } = JSON.parse(formDataStr)
        const selectedPack: BackendPack = JSON.parse(packDataStr)

        console.log("📦 Création de la réservation...", { formData, selectedPack })

        // ✅ MARQUER COMME "EN COURS" AVANT L'APPEL API
        hasCreatedReservation.current = true

        // Créer la réservation via backend
        const newReservation = await createReservation(
          selectedPack.id,
          formData.nom,
          formData.prenom,
          formData.telephone,
          formData.email,
          participants,
          formData.howDidYouKnow,
        )

        console.log("✅ Réservation créée:", newReservation)

        setReservation({
          id: newReservation.id,
          nom: newReservation.nom,
          telephone: newReservation.telephone,
          email: newReservation.email,
          packName: newReservation.packName,
          participants: newReservation.participants ?? [],
          totalPrice: newReservation.totalPrice,
          amountPaid: newReservation.amountPaid ?? 0,
          remainingAmount: newReservation.remainingAmount ?? 0,
          status: newReservation.status ?? "pending",
          createdAt: newReservation.createdAt,
          updatedAt: newReservation.updatedAt,
        })

        // Nettoyer sessionStorage après succès
        sessionStorage.removeItem("reservationFormData")
        sessionStorage.removeItem("selectedPack")
      } catch (err) {
        console.error("❌ [Summary] Erreur création réservation:", err)
        
        // ✅ EN CAS D'ERREUR, RÉINITIALISER LE FLAG
        hasCreatedReservation.current = false
        
        setError("Une erreur est survenue lors de la création de votre réservation.")
      } finally {
        setIsLoading(false)
      }
    }

    createReservationFromStorage()
  }, [router]) // ✅ Dépendances minimales

  const handleBackToReservation = () => {
    // Nettoyer toutes les données
    sessionStorage.removeItem("reservationFormData")
    sessionStorage.removeItem("selectedPack")
    
    // ✅ Réinitialiser le flag si on retourne en arrière
    hasCreatedReservation.current = false
    
    router.push("/reservation")
  }

  // Écran de chargement
  if (isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#333333] border-t-[#a00000] animate-spin mx-auto mb-4" />
          <p className="text-[#cccccc]">Création de votre réservation...</p>
        </div>
      </main>
    )
  }

  // Écran d'erreur
  if (error) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-[#a00000]/10 border border-[#a00000] rounded-lg p-6 text-[#dc143c] mb-4">
            {error}
          </div>
          <button
            onClick={handleBackToReservation}
            className="w-full bg-[#a00000] hover:bg-[#cc0000] text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Retour aux réservations
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full">
      <Header />

      {/* Popup automatique après création */}
      {reservation && (
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          reservation={reservation}
        />
      )}

      {/* HEADER */}
      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#1a0a0a] pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#f8f8f8] mb-4">Confirmation de réservation</h1>
          <p className="text-sm md:text-lg text-[#cccccc]">
            Votre réservation a été créée avec succès
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <section className="bg-[#0a0a0a] py-12 md:py-20 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBackToReservation}
            className="flex items-center gap-2 text-[#a00000] hover:text-[#dc143c] font-semibold text-sm mb-8 transition-colors"
          >
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