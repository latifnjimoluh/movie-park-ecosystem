"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PackSelector from "@/components/pack-selector"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import type { BackendPack } from "@/lib/types"

export default function ReservationPage() {
  const router       = useRouter()
  const { language } = useTheme()

  const handlePackSelect = (packId: string, packData: BackendPack) => {
    sessionStorage.setItem("selectedPack", JSON.stringify(packData))
    localStorage.setItem(
      "reservation_pack",
      JSON.stringify({ data: packData, expiresAt: Date.now() + 30 * 60 * 1000 }),
    )
    router.push(`/reservation/form?packId=${packId}`)
  }

  return (
    <main className="w-full">
      <Header />

      <section className="page-hero relative pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            🎟️ Réservation
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("reservationPage.title", language)}
          </h1>
          <p className="films-desc text-sm md:text-lg">
            {t("reservationPage.subtitle", language)}
          </p>
        </div>
      </section>

      <section className="page-section py-12 md:py-20 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <PackSelector onSelectPack={handlePackSelect} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
