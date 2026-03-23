"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"
import { getPackDetails } from "@/lib/pack-details"
import { fetchPacksFromDatabase } from "@/lib/packs-service"
import type { BackendPack } from "@/lib/types"

// Mapping des icônes par nom de pack (pour garder vos icônes personnalisées)
const PACK_ICONS: Record<string, string> = {
  simple: "🎟️",
  standard: "🎟️",
  classique: "🎟️",
  vip: "👑",
  couple: "❤️",
  duo: "❤️",
  famille: "👨‍👩‍👧‍👦",
  family: "👨‍👩‍👧‍👦",
  stand: "🏢",
}

// Détermine si un pack doit être "highlighted"
function shouldHighlight(packName: string): boolean {
  return packName.toLowerCase() === "vip"
}

// Récupère l'icône appropriée
function getPackIcon(packName: string): string {
  const normalized = packName.toLowerCase()
  return PACK_ICONS[normalized] || "🎫"
}

export default function Pricing() {
  const { language } = useTheme()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [packs, setPacks] = useState<BackendPack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Animation d'apparition
  useEffect(() => {
    const section = document.getElementById("pricing")
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Chargement des packs depuis le backend
  useEffect(() => {
    const loadPacks = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("[Pricing] Début du chargement des packs...")
        const fetched = await fetchPacksFromDatabase()
        console.log("[Pricing] Packs récupérés:", fetched)

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

  // Handler pour la sélection d'un pack - MODIFIÉ ✨
  const handleSelectPack = (pack: BackendPack) => {
    // Sauvegarder le pack dans sessionStorage
    sessionStorage.setItem('selectedPack', JSON.stringify(pack))
    
    // Rediriger directement vers /reservation/form avec l'ID du pack
    router.push(`/reservation/form?packId=${pack.id}`)
  }

  // Séparer le pack Stand des autres
  const standPack = packs.find((p) => p.name.toLowerCase() === "stand")
  const regularPacks = packs.filter((p) => p.name.toLowerCase() !== "stand")

  // Construire les données d'affichage pour les packs réguliers
  const displayPacks = regularPacks.map((pack) => {
    const details = getPackDetails(pack.name, language)
    
    // Nom avec fallback
    const name = details?.name && !details.name.includes("packsDetails") 
      ? details.name 
      : pack.name

    // Prix formaté
    const price = pack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")

    // Features filtrées : ne garder que les features valides
    const features = (details?.features || []).filter(
      (f) => f && !f.includes("packsDetails") && f.trim().length > 0
    )

    // Badge (pour VIP principalement)
    const badgeKey = t(`packs.${pack.name.toLowerCase()}.badge`, language)
    const badge = badgeKey.includes("packs.") ? null : badgeKey

    return {
      id: pack.id,
      key: pack.name.toLowerCase(),
      icon: getPackIcon(pack.name),
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
      className="w-full bg-gradient-to-b from-[#F5F5F5] to-white py-16 md:py-32 px-4 md:px-6"
    >
      <div className="max-w-6xl mx-auto">

        {/* TITRE */}
        <h2 className="text-3xl md:text-5xl font-bold text-black text-center mb-4">
          {t("pricing.title", language)}
        </h2>

        <p className="text-center text-gray-600 mb-12 md:mb-20 text-base md:text-lg max-w-2xl mx-auto">
          {t("pricing.subtitle", language)}
        </p>

        {/* ÉTAT DE CHARGEMENT */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement des packs...</p>
          </div>
        )}

        {/* ERREUR */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* PACKS GRID - Affichage uniquement si chargé et sans erreur */}
        {!isLoading && !error && displayPacks.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
              {displayPacks.map((pack, i) => (
                <div
                  key={pack.id}
                  className={`relative rounded-xl p-8 bg-white border-2 transition-all duration-500 flex flex-col
                    ${pack.highlight ? "border-[#DC143C] shadow-xl" : "border-black hover:border-[#DC143C] shadow-lg"}
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                  `}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  {/* BADGE */}
                  {pack.badge && (
                    <div className="absolute -top-3 right-4 bg-[#DC143C] text-white px-4 py-1 rounded-full text-xs font-bold">
                      {pack.badge}
                    </div>
                  )}

                  {/* ICONE */}
                  <div className="text-5xl text-center mb-4">{pack.icon}</div>

                  {/* NOM */}
                  <h3 className="text-2xl font-bold text-[#000000] mb-2">{pack.name}</h3>

                  {/* PRIX */}
                  <p className="text-4xl font-bold text-[#DC143C] text-center mb-6">
                    {pack.price} XAF
                  </p>

                  {/* FEATURES - Ne s'affiche que si des features valides existent */}
                  {pack.features.length > 0 && (
                    <ul className="space-y-3 mb-8 flex-grow">
                      {pack.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check
                            className={`flex-shrink-0 mt-1 ${
                              pack.highlight ? "text-[#DC143C]" : "text-gray-400"
                            }`}
                            size={18}
                          />
                          <span className="text-sm text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* BOUTON - Toujours en bas grâce à mt-auto - MODIFIÉ ✨ */}
                  <button
                    onClick={() => handleSelectPack(pack.backendData)}
                    className={`w-full py-3 rounded-lg font-bold transition-all text-base mt-auto ${
                      pack.highlight
                        ? "bg-[#DC143C] text-white hover:bg-[#8B0000]"
                        : "border-2 border-black text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {t("pricing.choose", language)}
                  </button>
                </div>
              ))}
            </div>

            {/* STAND PACK (si disponible) - MODIFIÉ ✨ */}
            {standPack && (
              <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] border-2 border-[#DC143C] rounded-2xl p-8 mb-12 shadow-xl shadow-red-900/40">

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">🏢</span>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {getPackDetails(standPack.name, language)?.name || standPack.name}
                    </h3>
                    <p className="text-base text-[#DC143C] font-semibold">
                      {standPack.description || t("pricing.standSubtitle", language)}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#333]">
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      {t("pricing.standPriceLabel", language)}
                    </p>
                    <p className="text-3xl font-bold text-[#DC143C]">
                      {standPack.price.toLocaleString(language === "fr" ? "fr-FR" : "en-US")} XAF
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      {t("pricing.standSetup", language)}
                    </p>
                    <ul className="space-y-2 text-white">
                      <li>{t("pricing.standSetup1", language)}</li>
                      <li>{t("pricing.standSetup2", language)}</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      {t("pricing.standServices", language)}
                    </p>
                    <ul className="space-y-2 text-white">
                      <li>{t("pricing.standElectricity", language)}</li>
                      <li>{t("pricing.standVisibility", language)}</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPack(standPack)}
                  className="w-full bg-[#DC143C] hover:bg-[#8B0000] text-white py-4 rounded-lg font-bold text-lg transition mb-2"
                >
                  {t("pricing.standCTA", language)}
                </button>

                <p className="text-center text-gray-400 text-xs">
                  {t("pricing.standPhoneNote", language)}
                </p>
              </div>
            )}

            {/* CTA global - MODIFIÉ ✨ */}
            <div className="text-center">
              <button
                onClick={() => router.push("/reservation")}
                className="bg-[#8B0000] hover:bg-[#DC143C] text-white px-16 py-4 rounded-lg font-bold text-lg transition shadow-lg shadow-red-900/40 hover:scale-105"
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