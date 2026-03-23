"use client"

import type { Participant, BackendPack } from "@/lib/types"
import { ChevronLeft, Loader2 } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

interface ReservationSummaryProps {
  packData: BackendPack
  formData: {
    nom: string
    prenom: string
    telephone: string
    email: string
    howDidYouKnow: string
  }
  participants: Participant[]
  onConfirm: () => void
  onBack: () => void
  isLoading?: boolean
  errors?: { [key: string]: string }
}

export default function ReservationSummary({
  packData,
  formData,
  participants,
  onConfirm,
  onBack,
  isLoading = false,
  errors = {},
}: ReservationSummaryProps) {
  const { language } = useTheme()

  // Nom du pack en minuscule
  const packName = packData.name.toLowerCase()

  // Capacité totale définie par le backend
  const totalCapacity = packData.capacity

  // Nombre total de personnes = payeur (1) + participants
  const peopleCount = 1 + participants.length

  // Prix : si chaque pack a 1 prix unique → totalPrice = pack.price
  const totalPrice = packData.price

  // Stand = cas particulier (ticket collectif)
  const isStandPack = packName === "stand"

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[#1a0a0a] to-[#0a0a0a] border border-[#333333] rounded-lg p-8">
        
        {/* TITLE */}
        <h3 className="text-2xl font-bold text-[#f8f8f8] mb-6">
          {t("reservationSummary.title", language)}
        </h3>

        {/* PACK DETAILS */}
        <div className="space-y-6 mb-8 pb-8 border-b border-[#333333]">

          <div className="flex justify-between">
            <span className="text-[#cccccc]">{t("reservationSummary.packLabel", language)}</span>
            <span className="font-bold text-[#f8f8f8]">{packData.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#cccccc]">{t("reservationSummary.priceLabel", language)}</span>
            <span className="font-bold text-[#dc143c]">
              {packData.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")} XAF
            </span>
          </div>

          {/* Capacity information */}
          {!isStandPack && (
            <div className="flex justify-between items-center bg-[#a00000]/10 p-4 rounded border border-[#a00000]/50">
              <span className="text-[#f8f8f8] text-sm">
                Capacité du pack : {totalCapacity} personnes
              </span>
              <span className="text-[#a00000] font-bold text-lg">
                {peopleCount} / {totalCapacity}
              </span>
            </div>
          )}

        </div>

        {/* USER DETAILS (PAYEUR = participant 1) */}
        <div className="space-y-6 mb-8 pb-8 border-b border-[#333333]">

          <div>
            <p className="text-sm text-[#999] mb-3 uppercase tracking-wider">
              {isStandPack
                ? t("reservationSummary.companyContact", language)
                : t("reservationSummary.reservingPerson", language)}
            </p>

            <p className="text-lg font-semibold text-[#f8f8f8]">
              {formData.prenom} {formData.nom}
            </p>

            <p className="text-[#cccccc]">{formData.telephone}</p>
            {formData.email && <p className="text-[#cccccc]">{formData.email}</p>}
          </div>

          {/* INCLUDED PARTICIPANTS */}
          {!isStandPack && participants.length > 0 && (
            <div>
              <p className="text-sm text-[#999] mb-3 uppercase tracking-wider">
                {t("reservationSummary.participantsIncluded", language)}
              </p>

              <ul className="space-y-2">
                {participants.map((p, i) => (
                  <li key={i} className="text-[#f8f8f8]">
                    {p.prenom} {p.nom}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* TOTAL */}
        <div className="bg-[#a00000]/10 border border-[#a00000]/50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-[#f8f8f8]">
              {t("reservationSummary.totalToPay", language)}
            </span>

            <span className="text-3xl font-bold text-[#dc143c]">
              {totalPrice.toLocaleString(language === "fr" ? "fr-FR" : "en-US")} XAF
            </span>
          </div>
        </div>
        {/* BLOC D'ERREURS */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-[#a00000]/10 border border-[#a00000] rounded-lg space-y-2 mb-6">
            <p className="text-[#f8f8f8] font-semibold mb-2">
              {language === "fr" ? "Veuillez remplir les champs suivants :" : "Please fill in the following fields:"}
            </p>
            {Object.entries(errors).map(([key, message]) => (
              <p key={key} className="text-[#dc143c] text-sm font-medium">
                • {message}
              </p>
            ))}
          </div>
        )}

        {/* BUTTONS */}
        <div className="space-y-4">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-[#a00000] hover:bg-[#cc0000] disabled:bg-[#666] disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-colors text-lg flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading
              ? t("reservationSummary.confirming", language)
              : t("reservationSummary.confirm", language)}
          </button>

          <button
            onClick={onBack}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] disabled:bg-[#333333] disabled:cursor-not-allowed text-[#f8f8f8] py-3 rounded-lg font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            {t("reservationSummary.back", language)}
          </button>
        </div>

      </div>
    </div>
  )
}
