"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"

const STORAGE_KEY = "mitp_special_popup_dismissed"

export default function SpecialEditionPopup() {
  const { language } = useTheme()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // N'afficher le popup qu'une seule fois par session
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden animate-scale-in"
        style={{
          background: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(109,40,217,0.12) 100%)",
          border: "1px solid rgba(167,139,250,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Fermer */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all z-10"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        {/* Dégradé décoratif haut */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: "linear-gradient(90deg, #A78BFA, #EC4899, #F59E0B)" }}
        />

        <div className="p-8 md:p-10 text-center">
          {/* Badge */}
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
            style={{
              background: "rgba(167,139,250,0.2)",
              border: "1px solid rgba(167,139,250,0.4)",
              color: "#C4B5FD",
            }}
          >
            {t("specialEditionPopup.badge", language)}
          </span>

          {/* Icône */}
          <div className="text-5xl mb-4">🤍</div>

          {/* Titre */}
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">
            {t("specialEditionPopup.title", language)}
          </h2>

          {/* Texte */}
          <p className="text-white/70 text-base leading-relaxed mb-3">
            {t("specialEditionPopup.subtitle", language)}
          </p>

          {/* Highlight */}
          <p
            className="text-sm font-semibold mb-8 px-4 py-2.5 rounded-xl"
            style={{
              background: "rgba(167,139,250,0.12)",
              border: "1px solid rgba(167,139,250,0.25)",
              color: "#C4B5FD",
            }}
          >
            {t("specialEditionPopup.highlight", language)}
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/don" onClick={dismiss} className="flex-1">
              <button
                type="button"
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #A78BFA, #7C3AED)",
                  color: "#fff",
                }}
              >
                🤍 {t("specialEditionPopup.ctaDon", language)}
              </button>
            </Link>

            <Link href="/reservation" onClick={dismiss} className="flex-1">
              <button
                type="button"
                className="w-full py-3.5 rounded-xl font-bold text-sm border transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(167,139,250,0.4)",
                  color: "#C4B5FD",
                }}
              >
                🎟️ {t("specialEditionPopup.ctaReservation", language)}
              </button>
            </Link>
          </div>

          {/* Ignorer */}
          <button
            type="button"
            onClick={dismiss}
            className="mt-5 text-white/30 text-xs hover:text-white/60 transition-colors"
          >
            {t("specialEditionPopup.close", language)}
          </button>
        </div>
      </div>
    </div>
  )
}
