"use client"

import { useEffect, useState } from "react"
import { Check, Building2, Crown, Ticket, Heart, Users } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import { fetchPacksFromDatabase } from "@/lib/packs-service"
import { getPackDetails } from "@/lib/pack-details"
import type { BackendPack } from "@/lib/types"

interface PackSelectorProps {
  onSelectPack: (packId: string, pack: BackendPack) => void
}

const PACK_ICONS: Record<string, React.ElementType> = {
  simple:    Ticket,
  standard:  Ticket,
  classique: Ticket,
  vip:       Crown,
  couple:    Heart,
  duo:       Heart,
  famille:   Users,
  family:    Users,
  stand:     Building2,
}

function getPackIcon(name: string): React.ElementType {
  return PACK_ICONS[name.toLowerCase()] ?? Ticket
}

function isVip(name: string): boolean {
  return name.toLowerCase() === "vip"
}

export default function PackSelector({ onSelectPack }: PackSelectorProps) {
  const { language } = useTheme()
  const [packs, setPacks] = useState<BackendPack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      <div className="text-center py-16">
        <div className="pricing-loading inline-flex items-center gap-3">
          <span className="animate-dove-flutter text-2xl">🕊️</span>
          Chargement des packs…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pricing-error p-4 rounded-xl mb-8">
        {error}
      </div>
    )
  }

  const standPack    = packs.find((p) => p.name.toLowerCase() === "stand")
  const regularPacks = packs.filter((p) => p.name.toLowerCase() !== "stand")

  return (
    <div className="space-y-10">

      {/* En-tête */}
      <div className="text-center mb-8">
        <span className="pricing-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
          🎟️ {t("packSelector.title", language)}
        </span>
        <p className="pricing-subtitle text-base md:text-lg max-w-2xl mx-auto">
          {t("packSelector.subtitle", language)}
        </p>
      </div>

      {/* Grille des packs réguliers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
        {regularPacks.map((pack) => {
          const details   = getPackDetails(pack.name, language)
          const highlight = isVip(pack.name)
          const IconComp  = getPackIcon(pack.name)
          const name      = details?.name && !details.name.includes("packsDetails")
            ? details.name
            : pack.name
          const features  = (details?.features || [])
            .filter((f) => f && !f.includes("packsDetails") && f.trim().length > 0)
            .slice(0, 3)

          return (
            <div
              key={pack.id}
              onClick={() => onSelectPack(pack.id, pack)}
              className={`pricing-card${highlight ? " highlight" : ""} relative rounded-2xl p-7 flex flex-col cursor-pointer`}
            >
              {/* Badge VIP */}
              {highlight && (
                <div className="pricing-vip-badge absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ {t("packSelector.popularTag", language)}
                </div>
              )}

              {/* Icône */}
              <div className="mb-5">
                <div className={`pricing-icon-wrap${highlight ? " highlight" : ""} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <IconComp size={22} className={highlight ? "text-[#F59E0B]" : "text-[#D4C8F5]"} />
                </div>
              </div>

              {/* Nom */}
              <h3 className={`text-xl font-bold mb-1 ${highlight ? "text-[#F59E0B]" : "text-white"}`}>
                {name}
              </h3>

              {/* Prix */}
              <p className="pricing-price text-3xl font-black mb-4">
                {pack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")}
                <span className="pricing-currency text-base font-medium ml-1">XAF</span>
              </p>

              {/* Description */}
              {(details?.description || pack.description) && (
                <p className="pricing-feature text-xs mb-4 leading-relaxed">
                  {details?.description || pack.description}
                </p>
              )}

              {/* Features */}
              {features.length > 0 && (
                <ul className="space-y-2 mb-6 flex-grow">
                  {features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check
                        size={14}
                        className={`flex-shrink-0 mt-0.5 ${highlight ? "text-[#F59E0B]" : "text-[#A78BFA]"}`}
                      />
                      <span className="pricing-feature text-xs leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Capacité */}
              <div className="flex items-center gap-2 mb-6 text-xs pricing-feature">
                <Check size={14} className={highlight ? "text-[#F59E0B]" : "text-[#A78BFA]"} />
                <span>
                  {pack.capacity === 1
                    ? "Pour 1 personne"
                    : `Capacité : ${pack.capacity} personnes`}
                </span>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelectPack(pack.id, pack) }}
                className={`pricing-btn${highlight ? " highlight" : ""} w-full py-3 rounded-xl font-bold text-sm mt-auto hover:scale-[1.02] transition-transform`}
              >
                {t("packSelector.choosePackButton", language)}
              </button>
            </div>
          )
        })}
      </div>

      {/* Pack Stand */}
      {standPack && (
        <div className="pricing-stand rounded-2xl p-7 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="pricing-stand-icon w-14 h-14 rounded-2xl flex items-center justify-center">
              <Building2 size={26} className="text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">
                {getPackDetails(standPack.name, language)?.name || standPack.name}
              </h3>
              <p className="text-sm font-medium mt-0.5 text-[#F59E0B]">
                {t("packSelector.standTagline", language)}
              </p>
            </div>
          </div>

          <div className="pricing-stand-grid grid md:grid-cols-3 gap-8 mb-8 pb-8">
            <div>
              <p className="pricing-stand-label text-xs uppercase tracking-wider mb-2">
                {t("packSelector.standTarifLabel", language)}
              </p>
              <p className="pricing-price text-3xl font-black">
                {standPack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")} XAF
              </p>
            </div>
            <div>
              <p className="pricing-stand-label text-xs uppercase tracking-wider mb-2">
                {t("packSelector.standCapacityLabel", language)}
              </p>
              <p className="text-2xl font-bold text-white">{standPack.capacity} personnes</p>
            </div>
            <div>
              <p className="pricing-stand-label text-xs uppercase tracking-wider mb-2">Description</p>
              <p className="pricing-feature text-sm leading-relaxed">{standPack.description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPack(standPack.id, standPack)}
            className="pricing-btn highlight w-full py-4 rounded-xl font-bold text-base hover:scale-[1.01] transition-transform"
          >
            {t("packSelector.standReserveButton", language)}
          </button>

          <p className="pricing-note text-center text-xs mt-3">
            {t("pricing.standPhoneNote", language)}
          </p>
        </div>
      )}
    </div>
  )
}
