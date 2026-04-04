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
  const [submitted, setSubmitted]         = useState(false)
  const { language }                      = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingPhone.trim()) setSubmitted(true)
  }

  return (
    <main className="w-full">
      <Header />

      <section className="page-hero py-16 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-12">
            <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
              🔍 Suivi
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {t("tracking.title", language)}
            </h1>
            <p className="films-desc text-xl">
              {t("tracking.subtitle", language)}
            </p>
          </div>

          {!submitted ? (
            <div className="tracking-form-card rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="contact-label block font-semibold mb-2">
                    {t("tracking.phoneLabel", language)}
                  </label>
                  <input
                    type="tel"
                    value={trackingPhone}
                    onChange={(e) => setTrackingPhone(e.target.value)}
                    className="contact-input w-full px-4 py-3 rounded-lg"
                    placeholder={t("tracking.phonePlaceholder", language)}
                  />
                </div>
                <button type="submit" className="header-cta-btn w-full py-4 rounded-xl font-semibold text-lg">
                  {t("tracking.searchButton", language)}
                </button>
              </form>
            </div>
          ) : (
            <ReservationTracking phone={trackingPhone} onReset={() => setSubmitted(false)} />
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
