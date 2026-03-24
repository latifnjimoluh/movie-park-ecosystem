"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ReservationForm from "@/components/reservation-form"
import ParticipantForm from "@/components/participant-form"
import ReservationSummary from "@/components/reservation-summary"
import { ChevronLeft } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import type { Participant, BackendPack } from "@/lib/types"

export default function ReservationFormPage() {
  const router = useRouter()
  const { language } = useTheme()

  const [selectedPack, setSelectedPack] = useState<BackendPack | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    howDidYouKnow: "",
  })

  useEffect(() => {
    // Try sessionStorage first, then localStorage with TTL as fallback
    const loadPack = () => {
      let packData = sessionStorage.getItem("selectedPack")
      if (!packData) {
        const stored = localStorage.getItem("reservation_pack")
        if (stored) {
          try {
            const { data, expiresAt } = JSON.parse(stored)
            if (Date.now() < expiresAt) {
              packData = JSON.stringify(data)
            } else {
              localStorage.removeItem("reservation_pack")
            }
          } catch {}
        }
      }
      if (packData) {
        try {
          setSelectedPack(JSON.parse(packData))
        } catch (err) {
          console.error("Erreur parsing pack:", err)
          router.push("/reservation")
        }
      } else {
        router.push("/reservation")
      }
    }
    loadPack()
  }, [router])

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleParticipantsChange = (p: Participant[]) => {
    setParticipants(p)
  }

  const handleConfirmReservation = () => {
    if (!selectedPack) return

    const newErrors: { [key: string]: string } = {}

    // Validation du formulaire principal
    if (!formData.nom.trim()) {
      newErrors.nom = `${t("reservationForm.lastnameLabel", language).replace(" *", "")} - ${t("reservationForm.required", language)}`
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = `${t("reservationForm.firstnameLabel", language).replace(" *", "")} - ${t("reservationForm.required", language)}`
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = `${t("reservationForm.phoneLabel", language)} - ${t("reservationForm.required", language)}`
    } else if (formData.telephone.replace(/\D/g, "").length < 9) {
      newErrors.telephone = `${t("reservationForm.phoneLabel", language)} - ${t("reservationForm.minDigits", language)}`
    }

    // NOUVELLE VALIDATION : Vérifier les participants
    if (selectedPack.capacity > 1) {
      // Pour le pack Couple : au moins 1 participant requis avec nom obligatoire
      if (selectedPack.name.toLowerCase() === "couple") {
        if (participants.length === 0) {
          newErrors.participants = language === "fr" 
            ? "Le pack Couple nécessite 2 personnes. Veuillez ajouter le 2ème participant."
            : "The Couple pack requires 2 people. Please add the 2nd participant."
        } else {
          // Vérifier que le participant a un nom
          participants.forEach((p, index) => {
            if (!p.nom || p.nom.trim() === "") {
              newErrors[`participant_${index}_nom`] = language === "fr"
                ? `Participant ${index + 2} - Nom requis`
                : `Participant ${index + 2} - Name required`
            }
          })
        }
      }
      
      // Pour les autres packs (Famille, Stand) : vérifier uniquement si des participants sont ajoutés
      else {
        participants.forEach((p, index) => {
          if (!p.nom || p.nom.trim() === "") {
            newErrors[`participant_${index}_nom`] = language === "fr"
              ? `Participant ${index + 2} - Nom requis`
              : `Participant ${index + 2} - Name required`
          }
        })
      }
    }

    // Si des erreurs existent, les afficher et arrêter
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Ajouter le préfixe 237 au téléphone si nécessaire
    let phoneWithPrefix = formData.telephone
    if (phoneWithPrefix && !phoneWithPrefix.startsWith("237")) {
      phoneWithPrefix = "237" + phoneWithPrefix
    }

    const reservationPayload = {
      formData: { ...formData, telephone: phoneWithPrefix },
      participants,
      packId: selectedPack.id,
    }

    // Save to sessionStorage + localStorage (TTL 30 min) for recovery
    sessionStorage.setItem("reservationFormData", JSON.stringify(reservationPayload))
    localStorage.setItem(
      "reservation_form",
      JSON.stringify({ data: reservationPayload, expiresAt: Date.now() + 30 * 60 * 1000 }),
    )

    router.push("/reservation/summary")
  }
  const handleBack = () => {
    sessionStorage.removeItem("selectedPack")
    router.push("/reservation")
  }

  if (!selectedPack) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#333333] border-t-[#a00000] animate-spin mx-auto mb-4" />
          <p className="text-[#cccccc]">Chargement...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full">
      <Header />

      {/* HEADER */}
      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#1a0a0a] pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#f8f8f8] mb-4">Formulaire de réservation</h1>
          <p className="text-sm md:text-lg text-[#cccccc] mb-8">
            Complétez vos informations pour finaliser votre réservation
          </p>
          {/* Stepper */}
          <div className="flex items-center gap-0 max-w-sm">
            {["Pack", "Informations", "Confirmation"].map((step, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${idx === 1 ? "bg-[#FACC15] text-[#0a0a0a]" : idx < 1 ? "bg-[#854D0E] text-white" : "bg-[#333] text-[#666]"}`}>
                    {idx < 1 ? "✓" : idx + 1}
                  </div>
                  <span className={`text-xs mt-1 whitespace-nowrap ${idx === 1 ? "text-[#FACC15]" : idx < 1 ? "text-[#854D0E]" : "text-[#666]"}`}>
                    {step}
                  </span>
                </div>
                {idx < 2 && <div className={`flex-1 h-0.5 mb-4 ${idx < 1 ? "bg-[#854D0E]" : "bg-[#333]"}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-[#0a0a0a] py-12 md:py-20 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Bouton retour */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#a00000] hover:text-[#dc143c] font-semibold text-sm mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("reservationPage.backToPacks", language)}
          </button>

          {/* Pack sélectionné */}
          <div className="border-b border-[#333] pb-6 mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-[#f8f8f8]">
              {selectedPack.name} – {selectedPack.price.toLocaleString("fr-FR")} XAF
            </h2>
          </div>

          {/* Formulaire principal */}
          <ReservationForm formData={formData} onChange={handleFormChange} errors={errors} />

          {/* Formulaire participants */}
          {selectedPack.capacity > 1 && (
            <div className="mt-8">
              <ParticipantForm
                pack={selectedPack.name}
                packCapacity={selectedPack.capacity}
                participants={participants}
                onChange={handleParticipantsChange}
                isPayeur={false}
              />
            </div>
          )}
{/* 
          {Object.keys(errors).length > 0 && (
            <div className="mt-6 p-4 bg-[#a00000]/10 border border-[#a00000] rounded-lg space-y-2">
              {Object.entries(errors).map(([key, message]) => (
                <p key={key} className="text-[#dc143c] text-sm">
                  {message}
                </p>
              ))}
            </div>
          )} */}

          {/* Résumé et confirmation */}
          <div className="mt-8">
            <ReservationSummary
              packData={selectedPack}
              formData={formData}
              participants={participants}
              onConfirm={handleConfirmReservation}
              onBack={handleBack}
              isLoading={false}
              errors={errors} 
              
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
