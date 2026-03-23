"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"

export default function Hero() {
  const [animateElements, setAnimateElements] = useState(false)
  const [stars, setStars] = useState<{ width: number; height: number; left: string; top: string; duration: number }[]>(
    [],
  )

  const { language } = useTheme()

  useEffect(() => {
    setAnimateElements(true)

    const generatedStars = Array.from({ length: 50 }).map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      duration: Math.random() * 3 + 2,
    }))

    setStars(generatedStars)
  }, [])

  return (
    <section className="relative w-full bg-[#0A0A0A] overflow-hidden pt-24 pb-12 md:pt-28 md:pb-16 flex flex-col justify-center">
      {/* Radial background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#DC143C]/20 via-transparent to-[#0A0A0A] pointer-events-none" />

      {/* Stars (client only → safe) */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-60"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              left: star.left,
              top: star.top,
              animationName: "twinkle",
              animationDuration: `${star.duration}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12">
        {/* Logo */}
        <div
          className={`mb-6 md:mb-8 transition-all duration-1200 ${
            animateElements ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "0.1s" }}
        >
          <div className="w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl shadow-red-950/50">
            <img src="/apple-icon.png" alt="Logo Movie in the Park" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-3xl md:text-7xl font-black text-white text-center uppercase tracking-widest mb-3 md:mb-4 transition-all duration-1200 ${
            animateElements ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          {t("hero.title", language)}
        </h1>

        {/* Tagline - Court et accrocheur */}
        <p
          className={`text-lg md:text-2xl text-[#F5F5F5] text-center font-light opacity-90 mb-6 md:mb-8 transition-all duration-1200 ${
            animateElements ? "opacity-90 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.6s" }}
        >
          Une soirée cinéma unique, sous les étoiles de Yaoundé.
        </p>

        {/* Sous-slogan émotionnel */}
        <p
          className={`text-sm md:text-base text-[#CCCCCC] text-center opacity-75 mb-6 md:mb-10 transition-all duration-1200 italic ${
            animateElements ? "opacity-75 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.7s" }}
        >
          Ambiance. Films. Expérience.
        </p>

        {/* Key Info - Date/Lieu/Horaire */}
        <div
          className={`bg-black/60 border border-[#DC143C]/30 rounded-xl px-6 md:px-12 py-5 md:py-6 mb-6 md:mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-12 transition-all duration-1200 max-w-4xl ${
            animateElements ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.9s" }}
        >
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="text-xl md:text-2xl text-[#DC143C]">📅</span>
            <div>
              <p className="text-xs md:text-sm text-[#CCCCCC]">{t("hero.dateLabel", language)}</p>
              <p className="text-white font-semibold text-sm md:text-base">{t("hero.dateValue", language)}</p>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=3.876146,11.518691"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-center md:text-left hover:text-[#DC143C] transition-colors cursor-pointer"
          >
            <span className="text-xl md:text-2xl text-[#DC143C]">📍</span>
            <div>
              <p className="text-xs md:text-sm text-[#CCCCCC]">{t("hero.locationLabel", language)}</p>
              <p className="text-white font-semibold text-sm md:text-base underline">
                {t("hero.locationValue", language)}
              </p>
            </div>
          </a>

          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="text-xl md:text-2xl text-[#DC143C]">🕕</span>
            <div>
              <p className="text-xs md:text-sm text-[#CCCCCC]">{t("hero.timeLabel", language)}</p>
              <p className="text-white font-semibold text-sm md:text-base">{t("hero.timeValue", language)}</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-8 transition-all duration-1200 w-full md:w-auto md:justify-center ${
            animateElements ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "1.2s" }}
        >
          <Link href="/films" className="flex-1 md:flex-none">
            <button className="w-full border-2 border-white text-white px-6 md:px-12 py-3 md:py-4 rounded-lg font-medium hover:bg-white hover:text-black transition-all text-sm md:text-base">
              {t("hero.ctaFilms", language)}
            </button>
          </Link>

          <Link href="/reservation" className="flex-1 md:flex-none">
            <button className="w-full bg-[#8B0000] hover:bg-[#DC143C] text-white px-6 md:px-12 py-3 md:py-4 rounded-lg font-bold hover:scale-105 transition-all shadow-lg shadow-red-950/50 text-sm md:text-base">
              {t("hero.ctaReservation", language)}
            </button>
          </Link>
        </div>

        <p
          className={`text-center text-sm md:text-base text-[#CCCCCC] transition-all duration-1200 ${
            animateElements ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "1.3s" }}
        >
          🎟️ Plus de 100 participants lors de la dernière édition
        </p>
      </div>
    </section>
  )
}
