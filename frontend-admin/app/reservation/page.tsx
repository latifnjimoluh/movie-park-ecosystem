"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PackSelector from "@/components/pack-selector"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import type { BackendPack } from "@/lib/types"

export default function ReservationPage() {
  const router = useRouter()
  const { language } = useTheme()

  const handlePackSelect = (packId: string, packData: BackendPack) => {
    // Save in sessionStorage + localStorage (TTL 30 min) for recovery
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

      {/* HEADER */}
      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#1a0a0a] pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#f8f8f8] mb-4">
            {t("reservationPage.title", language)}
          </h1>
          <p className="text-sm md:text-lg text-[#cccccc]">
            {t("reservationPage.subtitle", language)}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-[#0a0a0a] py-12 md:py-20 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <PackSelector onSelectPack={handlePackSelect} />
        </div>
      </section>

      <Footer />
    </main>
  )
}