"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"
import { MapPin, Calendar, Clock } from "lucide-react"
import { fetchEventConfig, FALLBACK_EVENT_CONFIG, type EventConfigMap } from "@/lib/content-service"

type Particle = {
  symbol: string
  left: string
  top: string
  size: number
  duration: number
  delay: number
  opacity: number
}

/* Symboles chrétiens de Pâques */
const DEFAULT_SYMBOLS = ["✝️", "🕊️", "🌸", "🌷", "🥚", "✨", "🌿", "🌺", "☀️", "🌱"]

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [config, setConfig]       = useState<EventConfigMap>(FALLBACK_EVENT_CONFIG)
  const { language }              = useTheme()

  useEffect(() => {
    fetchEventConfig().then(({ config: cfg }) => {
      setConfig(cfg)

      let symbols = DEFAULT_SYMBOLS
      try {
        const parsed = JSON.parse(cfg.particle_symbols || "[]")
        if (Array.isArray(parsed) && parsed.length > 0) symbols = parsed
      } catch { /* garde les defaults */ }

      const generated: Particle[] = Array.from({ length: 38 }).map(() => ({
        symbol:   symbols[Math.floor(Math.random() * symbols.length)],
        left:     Math.random() * 100 + "%",
        top:      Math.random() * 100 + "%",
        size:     Math.random() * 14 + 10,
        duration: Math.random() * 10 + 7,
        delay:    Math.random() * 6,
        opacity:  Math.random() * 0.30 + 0.10,
      }))
      setParticles(generated)
    })
  }, [])

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${config.location_lat},${config.location_lng}`

  return (
    <section className="hero-root relative w-full overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 flex flex-col justify-center">

      {/* Arrière-plans décoratifs */}
      <div className="hero-gradient-bg absolute inset-0 pointer-events-none" />
      <div className="hero-dot-grid    absolute inset-0 pointer-events-none" />
      <div className="hero-center-halo absolute inset-0 pointer-events-none" />

      {/* Particules de Pâques — valeurs entièrement dynamiques, inline obligatoire */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute select-none animate-particle-float"
            style={{
              left:              p.left,
              top:               p.top,
              fontSize:          `${p.size}px`,
              opacity:           p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay:    `${p.delay}s`,
            }}
          >
            {p.symbol}
          </span>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12 z-10">

        {/* Badge édition */}
        <div className="mb-5 animate-fade-in-up anim-delay-50">
          <span className="hero-edition-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
            ✝ {config.edition_label}
          </span>
        </div>

        {/* Logo avec auréole */}
        <div className="mb-7 md:mb-9 animate-scale-in anim-delay-120">
          <div className="hero-logo-ring w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden">
            <img
              src="/apple-icon.png"
              alt="Logo Movie in the Park"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Titre – dégradé aurore pascale */}
        <h1 className="text-gradient-easter text-4xl md:text-7xl font-black text-center uppercase tracking-widest mb-3 md:mb-4 animate-fade-in-up anim-delay-300">
          {t("hero.title", language)}
        </h1>

        {/* Tagline */}
        <p className="hero-tagline text-lg md:text-2xl text-center font-light mb-3 animate-fade-in-up anim-delay-500">
          {config.tagline}
        </p>

        {/* Sous-titre */}
        <p className="hero-subtitle text-sm md:text-base text-center mb-10 md:mb-14 italic animate-fade-in-up anim-delay-600">
          {config.subtitle}
        </p>

        {/* Carte info */}
        <div className="glass-purple hero-info-card relative rounded-2xl px-6 md:px-12 py-5 md:py-7 mb-9 md:mb-11 flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full max-w-3xl animate-fade-in-up anim-delay-800">

          <div className="flex items-center gap-3 text-center md:text-left">
            <Calendar size={19} className="flex-shrink-0 hero-icon-color" />
            <div>
              <p className="hero-info-label text-xs uppercase tracking-wider mb-0.5">
                {t("hero.dateLabel", language)}
              </p>
              <p className="text-white font-semibold text-sm md:text-base">
                {t("hero.dateValue", language)}
              </p>
            </div>
          </div>

          <div className="hero-divider hidden md:block w-px h-10 flex-shrink-0" />

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-center md:text-left group"
          >
            <MapPin size={19} className="flex-shrink-0 hero-icon-color" />
            <div>
              <p className="hero-info-label text-xs uppercase tracking-wider mb-0.5">
                {t("hero.locationLabel", language)}
              </p>
              <p className="text-white font-semibold text-sm md:text-base underline underline-offset-2 group-hover:text-[#A78BFA] transition-colors">
                {t("hero.locationValue", language)}
              </p>
            </div>
          </a>

          <div className="hero-divider hidden md:block w-px h-10 flex-shrink-0" />

          <div className="flex items-center gap-3 text-center md:text-left">
            <Clock size={19} className="flex-shrink-0 hero-icon-color" />
            <div>
              <p className="hero-info-label text-xs uppercase tracking-wider mb-0.5">
                {t("hero.timeLabel", language)}
              </p>
              <p className="text-white font-semibold text-sm md:text-base">
                {t("hero.timeValue", language)}
              </p>
            </div>
          </div>
        </div>

        {/* Boutons CTA */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5 mb-9 w-full max-w-xs md:max-w-none md:justify-center animate-fade-in-up anim-delay-1000">
          <Link href="/films" className="flex-1 md:flex-none">
            <button type="button" className="hero-btn-outline w-full px-8 md:px-12 py-3.5 md:py-4 rounded-xl font-medium text-sm md:text-base">
              {t("hero.ctaFilms", language)}
            </button>
          </Link>

          <Link href="/reservation" className="flex-1 md:flex-none">
            <button type="button" className="hero-btn-primary w-full px-8 md:px-12 py-3.5 md:py-4 rounded-xl font-bold text-sm md:text-base hover:scale-105 transition-transform">
              {t("hero.ctaReservation", language)}
            </button>
          </Link>
        </div>

        {/* Preuve sociale */}
        <p className="hero-social-proof text-center text-sm animate-fade-in-up anim-delay-1100">
          {config.social_proof}
        </p>
      </div>
    </section>
  )
}
