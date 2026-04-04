"use client"

import { useEffect, useState } from "react"
import { Check, Crown, Ticket, Heart, Users, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"
import { getPackDetails } from "@/lib/pack-details"
import { fetchPacksFromDatabase } from "@/lib/packs-service"
import type { BackendPack } from "@/lib/types"

const PACK_ICONS: Record<string, React.ElementType> = {
  simple:   Ticket,
  standard: Ticket,
  classique: Ticket,
  vip:      Crown,
  couple:   Heart,
  duo:      Heart,
  famille:  Users,
  family:   Users,
  stand:    Building2,
}

const PACK_DELAYS = ["anim-delay-0", "anim-delay-100", "anim-delay-200", "anim-delay-300"]

function shouldHighlight(packName: string): boolean {
  return packName.toLowerCase() === "vip"
}

function getPackIconComponent(packName: string): React.ElementType {
  const normalized = packName.toLowerCase()
  return PACK_ICONS[normalized] ?? Ticket
}

export default function Pricing() {
  const { language }              = useTheme()
  const router                    = useRouter()
  const [packs, setPacks]         = useState<BackendPack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)

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
        console.error("[Pricing] Erreur lors du chargement des packs:", err)
        setError("Erreur lors du chargement des packs.")
      } finally {
        setIsLoading(false)
      }
    }
    loadPacks()
  }, [])

  const handleSelectPack = (pack: BackendPack) => {
    sessionStorage.setItem("selectedPack", JSON.stringify(pack))
    router.push(`/reservation/form?packId=${pack.id}`)
  }

  const standPack    = packs.find((p) => p.name.toLowerCase() === "stand")
  const regularPacks = packs.filter((p) => p.name.toLowerCase() !== "stand")

  const displayPacks = regularPacks.map((pack) => {
    const details  = getPackDetails(pack.name, language)
    const name     = details?.name && !details.name.includes("packsDetails") ? details.name : pack.name
    const price    = pack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")
    const features = (details?.features || []).filter(
      (f) => f && !f.includes("packsDetails") && f.trim().length > 0
    )
    const badgeKey = t(`packs.${pack.name.toLowerCase()}.badge`, language)
    const badge    = badgeKey.includes("packs.") ? null : badgeKey

    return {
      id: pack.id,
      key: pack.name.toLowerCase(),
      IconComponent: getPackIconComponent(pack.name),
      highlight: shouldHighlight(pack.name),
      name,
      price,
      features,
      badge,
      backendData: pack,
    }
  })

  return (
    <section id="pricing" className="pricing-root w-full py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">

      {/* Halo violet */}
      <div className="pricing-halo absolute inset-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="text-center mb-12 md:mb-20">
          <span className="pricing-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            🎟️ Choisissez votre expérience
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("pricing.title", language)}
          </h2>
          <p className="pricing-subtitle text-base md:text-lg max-w-2xl mx-auto">
            {t("pricing.subtitle", language)}
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full text-sm font-semibold pricing-charity-note">
            {t("pricing.charityNote", language)}
          </div>
        </div>

        {/* Chargement */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="pricing-loading inline-flex items-center gap-3">
              <span className="animate-dove-flutter text-xl">🕊️</span>
              Chargement des packs…
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="pricing-error p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Grille des packs */}
        {!isLoading && !error && displayPacks.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 mb-16">
              {displayPacks.map((pack, i) => {
                const IconComp = pack.IconComponent
                return (
                  <div
                    key={pack.id}
                    className={`pricing-card${pack.highlight ? " highlight" : ""} relative rounded-2xl p-7 flex flex-col animate-fade-in-up ${PACK_DELAYS[i] ?? "anim-delay-300"}`}
                  >
                    {/* Badge VIP */}
                    {pack.badge && (
                      <div className="pricing-vip-badge absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold">
                        {pack.badge}
                      </div>
                    )}

                    {/* Icône */}
                    <div className="mb-5">
                      <div className={`pricing-icon-wrap${pack.highlight ? " highlight" : ""} w-12 h-12 rounded-xl flex items-center justify-center`}>
                        <IconComp size={22} className={pack.highlight ? "text-[#F59E0B]" : "text-[#D4C8F5]"} />
                      </div>
                    </div>

                    {/* Nom */}
                    <h3 className={`text-xl font-bold mb-1 ${pack.highlight ? "text-[#F59E0B]" : "text-white"}`}>
                      {pack.name}
                    </h3>

                    {/* Prix */}
                    <p className="pricing-price text-3xl font-black mb-6">
                      {pack.price}
                      <span className="pricing-currency text-base font-medium ml-1">XAF</span>
                    </p>

                    {/* Fonctionnalités */}
                    {pack.features.length > 0 && (
                      <ul className="space-y-2.5 mb-7 flex-grow">
                        {pack.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check
                              size={16}
                              className={`flex-shrink-0 mt-0.5 ${pack.highlight ? "text-[#F59E0B]" : "text-[#A78BFA]"}`}
                            />
                            <span className="pricing-feature text-sm leading-snug">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Note caritative */}
                    <p className="pricing-charity-tag text-xs text-center mt-1 mb-3">
                      🤍 Contribue à la cause orphelins
                    </p>

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() => handleSelectPack(pack.backendData)}
                      className={`pricing-btn${pack.highlight ? " highlight" : ""} w-full py-3 rounded-xl font-bold transition-all text-sm mt-auto hover:scale-[1.02]`}
                    >
                      {t("pricing.choose", language)}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Pack Stand */}
            {standPack && (
              <div className="pricing-stand rounded-2xl p-7 md:p-10 mb-14">
                <div className="flex items-center gap-4 mb-8">
                  <div className="pricing-stand-icon w-14 h-14 rounded-2xl flex items-center justify-center">
                    <Building2 size={26} className="text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {getPackDetails(standPack.name, language)?.name || standPack.name}
                    </h3>
                    <p className="text-sm font-medium mt-0.5 text-[#F59E0B]">
                      {standPack.description || t("pricing.standSubtitle", language)}
                    </p>
                  </div>
                </div>

                <div className="pricing-stand-grid grid md:grid-cols-3 gap-8 mb-8 pb-8">
                  <div>
                    <p className="pricing-stand-label text-xs uppercase tracking-wider mb-2">
                      {t("pricing.standPriceLabel", language)}
                    </p>
                    <p className="pricing-price text-3xl font-black">
                      {standPack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")} XAF
                    </p>
                  </div>

                  <div>
                    <p className="pricing-stand-label text-xs uppercase tracking-wider mb-2">
                      {t("pricing.standSetup", language)}
                    </p>
                    <ul className="pricing-feature space-y-1.5 text-sm">
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-[#F59E0B]" />
                        {t("pricing.standSetup1", language)}
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-[#F59E0B]" />
                        {t("pricing.standSetup2", language)}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="pricing-stand-label text-xs uppercase tracking-wider mb-2">
                      {t("pricing.standServices", language)}
                    </p>
                    <ul className="pricing-feature space-y-1.5 text-sm">
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-[#F59E0B]" />
                        {t("pricing.standElectricity", language)}
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-[#F59E0B]" />
                        {t("pricing.standVisibility", language)}
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPack(standPack)}
                  className="pricing-btn highlight w-full py-4 rounded-xl font-bold text-base hover:scale-[1.01] transition-transform"
                >
                  {t("pricing.standCTA", language)}
                </button>

                <p className="pricing-note text-center text-xs mt-3">
                  {t("pricing.standPhoneNote", language)}
                </p>
              </div>
            )}

            {/* CTA global */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/reservation")}
                className="pricing-global-cta px-14 py-4 rounded-xl font-bold text-base hover:scale-105 transition-transform"
              >
                {t("pricing.reservationCTA", language)}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
