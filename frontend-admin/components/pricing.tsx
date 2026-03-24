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

function shouldHighlight(packName: string): boolean {
  return packName.toLowerCase() === "vip"
}

function getPackIconComponent(packName: string): React.ElementType {
  const normalized = packName.toLowerCase()
  return PACK_ICONS[normalized] ?? Ticket
}

export default function Pricing() {
  const { language } = useTheme()
  const router = useRouter()
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
    <section
      id="pricing"
      className="w-full py-16 md:py-28 px-4 md:px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0E0E1A 0%, #080810 60%, #0E0E1A 100%)",
      }}
    >
      {/* Gold radial orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(250,204,21,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <span
            className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              border: "1px solid rgba(250,204,21,0.4)",
              background: "rgba(250,204,21,0.08)",
              color: "#FACC15",
            }}
          >
            🎟️ Choisissez votre expérience
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("pricing.title", language)}
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#CCCCBB" }}>
            {t("pricing.subtitle", language)}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3" style={{ color: "#CCCCBB" }}>
              <span className="animate-spin text-xl">✨</span>
              Chargement des packs…
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="p-4 rounded-xl mb-8"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#FCA5A5",
            }}
          >
            {error}
          </div>
        )}

        {/* Pack grid */}
        {!isLoading && !error && displayPacks.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 mb-16">
              {displayPacks.map((pack, i) => {
                const IconComp = pack.IconComponent

                return (
                  <div
                    key={pack.id}
                    className="relative rounded-2xl p-7 flex flex-col backdrop-blur-sm animate-fade-in-up"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      background: pack.highlight
                        ? "rgba(250,204,21,0.07)"
                        : "rgba(255,255,255,0.03)",
                      border: pack.highlight
                        ? "1px solid rgba(250,204,21,0.55)"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: pack.highlight
                        ? "0 0 35px rgba(250,204,21,0.28), 0 0 80px rgba(250,204,21,0.1), 0 4px 20px rgba(0,0,0,0.5)"
                        : "0 4px 20px rgba(0,0,0,0.3)",
                      animation: pack.highlight ? "gold-pulse 2.8s ease-in-out infinite" : undefined,
                    }}
                  >
                    {/* VIP badge */}
                    {pack.badge && (
                      <div
                        className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: "linear-gradient(135deg, #FACC15, #CA8A04)",
                          color: "#080810",
                        }}
                      >
                        {pack.badge}
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: pack.highlight
                            ? "rgba(250,204,21,0.15)"
                            : "rgba(255,255,255,0.06)",
                        }}
                      >
                        <IconComp
                          size={22}
                          style={{ color: pack.highlight ? "#FACC15" : "#CCCCBB" }}
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ color: pack.highlight ? "#FACC15" : "#FFFFFF" }}
                    >
                      {pack.name}
                    </h3>

                    {/* Price */}
                    <p
                      className="text-3xl font-black mb-6"
                      style={{ color: "#FACC15" }}
                    >
                      {pack.price}
                      <span className="text-base font-medium ml-1" style={{ color: "#CCCCBB" }}>
                        XAF
                      </span>
                    </p>

                    {/* Features */}
                    {pack.features.length > 0 && (
                      <ul className="space-y-2.5 mb-7 flex-grow">
                        {pack.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check
                              size={16}
                              className="flex-shrink-0 mt-0.5"
                              style={{
                                color: pack.highlight ? "#FACC15" : "#10B981",
                              }}
                            />
                            <span className="text-sm leading-snug" style={{ color: "#CCCCBB" }}>
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA */}
                    <button
                      onClick={() => handleSelectPack(pack.backendData)}
                      className="w-full py-3 rounded-xl font-bold transition-all text-sm mt-auto hover:scale-[1.02]"
                      style={
                        pack.highlight
                          ? {
                              background: "linear-gradient(135deg, #FACC15 0%, #CA8A04 100%)",
                              color: "#080810",
                              boxShadow: "0 4px 15px rgba(250,204,21,0.35)",
                            }
                          : {
                              border: "1px solid rgba(255,255,255,0.18)",
                              color: "rgba(255,255,255,0.8)",
                              background: "transparent",
                            }
                      }
                      onMouseEnter={(e) => {
                        if (!pack.highlight) {
                          const btn = e.currentTarget
                          btn.style.borderColor = "rgba(250,204,21,0.5)"
                          btn.style.color = "#FACC15"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!pack.highlight) {
                          const btn = e.currentTarget
                          btn.style.borderColor = "rgba(255,255,255,0.18)"
                          btn.style.color = "rgba(255,255,255,0.8)"
                        }
                      }}
                    >
                      {t("pricing.choose", language)}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Stand pack */}
            {standPack && (
              <div
                className="rounded-2xl p-7 md:p-10 mb-14 transition-all duration-700"
                style={{
                  background: "linear-gradient(135deg, rgba(250,204,21,0.06) 0%, rgba(202,138,4,0.04) 100%)",
                  border: "1px solid rgba(250,204,21,0.4)",
                  boxShadow: "0 8px 50px rgba(250,204,21,0.12), 0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(250,204,21,0.15)" }}
                  >
                    <Building2 size={26} style={{ color: "#FACC15" }} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {getPackDetails(standPack.name, language)?.name || standPack.name}
                    </h3>
                    <p className="text-sm font-medium mt-0.5" style={{ color: "#FACC15" }}>
                      {standPack.description || t("pricing.standSubtitle", language)}
                    </p>
                  </div>
                </div>

                <div
                  className="grid md:grid-cols-3 gap-8 mb-8 pb-8"
                  style={{ borderBottom: "1px solid rgba(250,204,21,0.15)" }}
                >
                  <div>
                    <p
                      className="text-xs uppercase tracking-wider mb-2"
                      style={{ color: "rgba(250,204,21,0.55)" }}
                    >
                      {t("pricing.standPriceLabel", language)}
                    </p>
                    <p className="text-3xl font-black" style={{ color: "#FACC15" }}>
                      {standPack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")} XAF
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-xs uppercase tracking-wider mb-2"
                      style={{ color: "rgba(250,204,21,0.55)" }}
                    >
                      {t("pricing.standSetup", language)}
                    </p>
                    <ul className="space-y-1.5 text-sm" style={{ color: "#CCCCBB" }}>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#FACC15" }} />
                        {t("pricing.standSetup1", language)}
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#FACC15" }} />
                        {t("pricing.standSetup2", language)}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p
                      className="text-xs uppercase tracking-wider mb-2"
                      style={{ color: "rgba(250,204,21,0.55)" }}
                    >
                      {t("pricing.standServices", language)}
                    </p>
                    <ul className="space-y-1.5 text-sm" style={{ color: "#CCCCBB" }}>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#FACC15" }} />
                        {t("pricing.standElectricity", language)}
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#FACC15" }} />
                        {t("pricing.standVisibility", language)}
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPack(standPack)}
                  className="w-full py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.01] hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #FACC15 0%, #CA8A04 100%)",
                    color: "#080810",
                    boxShadow: "0 4px 20px rgba(250,204,21,0.35)",
                  }}
                >
                  {t("pricing.standCTA", language)}
                </button>

                <p className="text-center text-xs mt-3" style={{ color: "#88887A" }}>
                  {t("pricing.standPhoneNote", language)}
                </p>
              </div>
            )}

            {/* Global CTA */}
            <div className="text-center">
              <button
                onClick={() => router.push("/reservation")}
                className="px-14 py-4 rounded-xl font-bold text-base transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #CA8A04 0%, #FACC15 100%)",
                  color: "#080810",
                  boxShadow: "0 4px 24px rgba(250,204,21,0.35)",
                }}
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
