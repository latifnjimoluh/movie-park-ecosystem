"use client"

import { useEffect, useState } from "react"
import { Check, Building2 } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import { fetchPacksFromDatabase } from "@/lib/packs-service"
import { getPackDetails } from "@/lib/pack-details"
import type { BackendPack } from "@/lib/types"

interface PackSelectorProps {
  onSelectPack: (packId: string, pack: BackendPack) => void
}

export default function PackSelector({ onSelectPack }: PackSelectorProps) {
  const { language } = useTheme()

  const [packs, setPacks] = useState<BackendPack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ---------------------------------------------
  // LOAD PACKS FROM BACKEND
  // ---------------------------------------------
  useEffect(() => {
    const loadPacks = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const fetched = await fetchPacksFromDatabase()

        if (!fetched || fetched.length === 0) {
          setError("Aucun pack disponible pour le moment.")
          return
        }

        setPacks(fetched)
      } catch (err) {
        console.error("[PackSelector] Error loading packs:", err)
        setError("Erreur lors du chargement des packs.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPacks()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-[#cccccc]">Chargement des packs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-[#854D0E]/10 border border-[#854D0E] text-[#FACC15] rounded-lg">
        {error}
      </div>
    )
  }

  // Split Stand from others
  const standPack = packs.find((p) => p.name.toLowerCase() === "stand")
  const regularPacks = packs.filter((p) => p.name.toLowerCase() !== "stand")

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#f8f8f8] mb-2">
          {t("packSelector.title", language)}
        </h2>
        <p className="text-sm md:text-lg text-[#cccccc]">
          {t("packSelector.subtitle", language)}
        </p>
      </div>

      {/* GRID OF STANDARD PACKS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {regularPacks.map((pack) => {
          // 🔥 Retrieve pack details dynamically
          const details = getPackDetails(pack.name, language)

          return (
            <div
              key={pack.id}
              onClick={() => onSelectPack(pack.id, pack)}
              className={`p-6 md:p-8 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg hover:shadow-[#854D0E]/30 
                ${
                  pack.name.toLowerCase() === "vip"
                    ? "bg-gradient-to-br from-[#1a0a0a] to-[#2a0a0a] border-[#FACC15]"
                    : "bg-[#121212] border-[#333]"
                }`}
            >
              {/* VIP BADGE */}
              {pack.name.toLowerCase() === "vip" && (
                <div className="mb-4 inline-block px-3 py-1 bg-[#854D0E] text-white text-xs font-bold rounded">
                  {t("packSelector.popularTag", language)}
                </div>
              )}

              {/* PACK NAME */}
              <h3 className="text-xl md:text-2xl font-bold text-[#f8f8f8] mb-2">
                {details?.name || pack.name}
              </h3>

              {/* PRICE */}
              <div className="text-3xl font-bold text-[#FACC15] mb-4">
                {pack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")} XAF
              </div>

              {/* DESCRIPTION */}
              <p className="text-[#cccccc] text-sm mb-4">
                {details?.description || pack.description}
              </p>

              {/* FEATURES */}
              <div className="space-y-2 mb-4">
                {(details?.features || []).slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#cccccc]">
                    <Check className="w-4 h-4 text-[#854D0E] mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CAPACITY */}
              <div className="flex gap-2 text-xs text-[#cccccc] mb-6">
                <Check className="w-4 h-4 text-[#854D0E] mt-0.5" />
                <span>
                  {pack.capacity === 1
                    ? "Pour 1 personne"
                    : `Capacité: ${pack.capacity} personnes`}
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={() => onSelectPack(pack.id, pack)}
                className="w-full bg-[#854D0E] hover:bg-[#cc0000] text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {t("packSelector.choosePackButton", language)}
              </button>
            </div>
          )
        })}
      </div>

      {/* SPECIAL STAND PACK */}
      {standPack && (
        <div className="bg-[#121212] border-2 border-[#854D0E] rounded-lg p-6 md:p-8 shadow-lg shadow-[#854D0E]/30">
          {/* HEADER */}
          <div className="flex gap-4 items-start mb-6">
            <Building2 className="w-8 h-8 text-[#FACC15]" />

            <div>
              <h3 className="text-2xl font-bold text-[#f8f8f8]">{standPack.name}</h3>
              <p className="text-sm text-[#854D0E] font-semibold">
                {t("packSelector.standTagline", language)}
              </p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* PRICE */}
            <div>
              <p className="text-xs text-[#999] uppercase mb-2">
                {t("packSelector.standTarifLabel", language)}
              </p>
              <p className="text-3xl font-bold text-[#FACC15]">
                {standPack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")} XAF
              </p>
            </div>

            {/* CAPACITY */}
            <div>
              <p className="text-xs text-[#999] uppercase mb-2">
                {t("packSelector.standCapacityLabel", language)}
              </p>
              <p className="text-2xl font-bold text-[#f8f8f8]">
                {standPack.capacity} personnes
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <p className="text-xs text-[#999] uppercase mb-2">Description</p>
              <p className="text-sm text-[#f8f8f8] font-semibold">
                {standPack.description}
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onSelectPack(standPack.id, standPack)}
            className="w-full bg-[#854D0E] hover:bg-[#cc0000] text-white py-4 rounded-lg font-semibold transition-colors"
          >
            {t("packSelector.standReserveButton", language)}
          </button>
        </div>
      )}
    </div>
  )
}
