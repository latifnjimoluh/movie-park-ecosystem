"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ReservationTracking from "@/components/reservation-tracking"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

export default function TrackingPage() {
  const [trackingPhone, setTrackingPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const { language } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingPhone.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <main className="w-full">
      <Header />

      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#1a0a0a] py-16 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">

          {/* TITLE + SUBTITLE */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-[#f8f8f8] mb-4">
              {t("tracking.title", language)}
            </h1>

            <p className="text-xl text-[#cccccc]">
              {t("tracking.subtitle", language)}
            </p>
          </div>

          {/* SEARCH FORM */}
          {!submitted ? (
            <div className="bg-[#121212] rounded-lg p-8 border border-[#333333]">

              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="block text-[#f8f8f8] font-semibold mb-2">
                    {t("tracking.phoneLabel", language)}
                  </label>

                  <input
                    type="tel"
                    value={trackingPhone}
                    onChange={(e) => setTrackingPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333333] rounded-lg text-[#f8f8f8] placeholder-[#666666] focus:outline-none focus:border-[#a00000] focus:ring-1 focus:ring-[#a00000]"
                    placeholder={t("tracking.phonePlaceholder", language)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#a00000] hover:bg-[#cc0000] text-white py-4 rounded-lg font-semibold transition-colors text-lg"
                >
                  {t("tracking.searchButton", language)}
                </button>

              </form>
            </div>
          ) : (
            <ReservationTracking
              phone={trackingPhone}
              onReset={() => setSubmitted(false)}
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
