"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"
import { MapPin, Calendar, Clock } from "lucide-react"

const PARTICLE_SYMBOLS = ["🌸", "🌼", "🌿", "🌺", "🥚", "✨", "🌱", "🐣"]

type Particle = {
  symbol: string
  left: string
  top: string
  size: number
  duration: number
  delay: number
  opacity: number
}

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([])
  const { language } = useTheme()

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 40 }).map(() => ({
      symbol: PARTICLE_SYMBOLS[Math.floor(Math.random() * PARTICLE_SYMBOLS.length)],
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      size: Math.random() * 14 + 10,
      duration: Math.random() * 10 + 7,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.35 + 0.1,
    }))
    setParticles(generated)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 flex flex-col justify-center"
      style={{ background: "#080810", minHeight: "88vh" }}
    >
      {/* Deep radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 65% at 50% 15%, rgba(250,204,21,0.13) 0%, rgba(202,138,4,0.05) 45%, transparent 68%), radial-gradient(ellipse 55% 45% at 15% 85%, rgba(16,185,129,0.07) 0%, transparent 55%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(250,204,21,0.18) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.06,
        }}
      />

      {/* Easter particles (client only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute select-none animate-particle-float"
            style={{
              left: p.left,
              top: p.top,
              fontSize: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.symbol}
          </span>
        ))}
      </div>

      {/* Main content — CSS animations, visible on SSR */}
      <div className="relative flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12 z-10">

        {/* Edition badge */}
        <div className="mb-5 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase backdrop-blur-sm"
            style={{
              border: "1px solid rgba(250,204,21,0.4)",
              background: "rgba(250,204,21,0.1)",
              color: "#FACC15",
            }}
          >
            🐣 Édition Pâques 2026
          </span>
        </div>

        {/* Logo */}
        <div className="mb-7 md:mb-9 animate-scale-in" style={{ animationDelay: "0.12s" }}>
          <div
            className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 1px rgba(250,204,21,0.3), 0 0 30px rgba(250,204,21,0.25), 0 0 70px rgba(250,204,21,0.08)",
            }}
          >
            <img
              src="/apple-icon.png"
              alt="Logo Movie in the Park"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title with gold gradient */}
        <h1
          className="text-4xl md:text-7xl font-black text-center uppercase tracking-widest mb-3 md:mb-4 animate-fade-in-up"
          style={{
            animationDelay: "0.3s",
            background: "linear-gradient(135deg, #FDE68A 0%, #FACC15 30%, #CA8A04 65%, #FACC15 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("hero.title", language)}
        </h1>

        {/* Tagline */}
        <p
          className="text-lg md:text-2xl text-center font-light mb-3 animate-fade-in-up"
          style={{ animationDelay: "0.5s", color: "#F0F0E8" }}
        >
          Une soirée cinéma unique, sous les étoiles de Yaoundé.
        </p>

        <p
          className="text-sm md:text-base text-center mb-10 md:mb-14 italic animate-fade-in-up"
          style={{ animationDelay: "0.6s", color: "rgba(250,204,21,0.65)" }}
        >
          Ambiance · Films · Expérience Printanière
        </p>

        {/* Glassmorphism info card */}
        <div
          className="relative rounded-2xl px-6 md:px-12 py-5 md:py-7 mb-9 md:mb-11 flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full max-w-3xl backdrop-blur-md animate-fade-in-up"
          style={{
            animationDelay: "0.8s",
            background: "rgba(250,204,21,0.05)",
            border: "1px solid rgba(250,204,21,0.22)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(250,204,21,0.1)",
          }}
        >
          <div className="flex items-center gap-3 text-center md:text-left">
            <Calendar size={19} className="flex-shrink-0" style={{ color: "#FACC15" }} />
            <div>
              <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "rgba(250,204,21,0.55)" }}>
                {t("hero.dateLabel", language)}
              </p>
              <p className="text-white font-semibold text-sm md:text-base">
                {t("hero.dateValue", language)}
              </p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 flex-shrink-0" style={{ background: "rgba(250,204,21,0.18)" }} />

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=3.876146,11.518691"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-center md:text-left transition-colors group"
          >
            <MapPin size={19} className="flex-shrink-0" style={{ color: "#FACC15" }} />
            <div>
              <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "rgba(250,204,21,0.55)" }}>
                {t("hero.locationLabel", language)}
              </p>
              <p className="text-white font-semibold text-sm md:text-base underline underline-offset-2 group-hover:text-[#FACC15] transition-colors">
                {t("hero.locationValue", language)}
              </p>
            </div>
          </a>

          <div className="hidden md:block w-px h-10 flex-shrink-0" style={{ background: "rgba(250,204,21,0.18)" }} />

          <div className="flex items-center gap-3 text-center md:text-left">
            <Clock size={19} className="flex-shrink-0" style={{ color: "#FACC15" }} />
            <div>
              <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "rgba(250,204,21,0.55)" }}>
                {t("hero.timeLabel", language)}
              </p>
              <p className="text-white font-semibold text-sm md:text-base">
                {t("hero.timeValue", language)}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col md:flex-row gap-4 md:gap-5 mb-9 w-full max-w-xs md:max-w-none md:justify-center animate-fade-in-up"
          style={{ animationDelay: "1.0s" }}
        >
          <Link href="/films" className="flex-1 md:flex-none">
            <button
              className="w-full px-8 md:px-12 py-3.5 md:py-4 rounded-xl font-medium transition-all text-sm md:text-base backdrop-blur-sm hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" }}
            >
              {t("hero.ctaFilms", language)}
            </button>
          </Link>

          <Link href="/reservation" className="flex-1 md:flex-none">
            <button
              className="w-full px-8 md:px-12 py-3.5 md:py-4 rounded-xl font-bold transition-all text-sm md:text-base hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #FACC15 0%, #CA8A04 100%)",
                color: "#080810",
                boxShadow: "0 4px 20px rgba(250,204,21,0.4), 0 1px 0 rgba(255,255,255,0.25) inset",
              }}
            >
              {t("hero.ctaReservation", language)}
            </button>
          </Link>
        </div>

        {/* Social proof */}
        <p
          className="text-center text-sm animate-fade-in-up"
          style={{ animationDelay: "1.1s", color: "#CCCCBB" }}
        >
          🎟️ Plus de 100 participants lors de la dernière édition
        </p>
      </div>
    </section>
  )
}
