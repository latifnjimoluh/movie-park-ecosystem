"use client"

import { useEffect, useState } from "react"
import { Clock, Globe, Calendar } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"
import {
  fetchFilms,
  fetchEventConfig,
  filmTitle,
  filmGenre,
  filmCountry,
  filmSynopsis,
  resolveImageUrl,
  type DbFilm,
  type EventConfigMap,
  FALLBACK_EVENT_CONFIG,
} from "@/lib/content-service"

/* Délais d'entrée pour les cartes (index 0‥4) */
const CARD_DELAYS = [
  "anim-delay-0",
  "anim-delay-200",
  "anim-delay-400",
  "anim-delay-600",
  "anim-delay-800",
]

export default function Films() {
  const { language }              = useTheme()
  const [films, setFilms]         = useState<DbFilm[]>([])
  const [config, setConfig]       = useState<EventConfigMap>(FALLBACK_EVENT_CONFIG)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchFilms(), fetchEventConfig()]).then(([filmsResult, configResult]) => {
      setFilms(filmsResult.films)
      setConfig(configResult.config)
      setIsLoading(false)
    })
  }, [])

  return (
    <section id="films" className="films-root w-full py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">

      {/* Halo accent */}
      <div className="films-halo absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* En-tête de section */}
        <div className="text-center mb-12 md:mb-16">
          <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            🕊️ {config.films_badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            {t("filmsSection.title", language)}
          </h2>
          <p className="films-desc text-base md:text-lg max-w-2xl mx-auto">
            {config.films_description}
          </p>
        </div>

        {/* Chargement */}
        {isLoading && (
          <div className="films-loading text-center py-12">
            <span className="animate-dove-flutter inline-block text-xl mr-2">🕊️</span>
            Chargement…
          </div>
        )}

        {/* Cartes films */}
        {!isLoading && (
          <div className="space-y-8 md:space-y-10">
            {films.map((film, index) => {
              const title    = filmTitle(film, language)
              const genre    = filmGenre(film, language)
              const country  = filmCountry(film, language)
              const synopsis = filmSynopsis(film, language)

              return (
                <div
                  key={film.id}
                  className={`films-card group relative rounded-2xl overflow-hidden animate-fade-in-up ${CARD_DELAYS[index] ?? "anim-delay-800"}`}
                >
                  {/* Halo violet au survol */}
                  <div className="films-card-hover-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl" />

                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-7 md:gap-10">

                    {/* Affiche */}
                    <div className="flex-shrink-0">
                      <div className="relative overflow-hidden rounded-xl w-full md:w-56">
                        <img
                          src={resolveImageUrl(film)}
                          alt={title}
                          className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="films-poster-gradient absolute inset-0" />
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">{title}</h3>

                      {/* Badges genre/année/pays */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        <span className="films-badge-genre px-3 py-1 rounded-full text-xs font-semibold">
                          {genre}
                        </span>
                        {film.year && (
                          <span className="films-badge-year inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
                            <Calendar size={11} />
                            {film.year}
                          </span>
                        )}
                        <span className="films-badge-country inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
                          <Globe size={11} />
                          {country}
                        </span>
                      </div>

                      {/* Heure de diffusion */}
                      {film.screening_time && (
                        <div className="flex items-center gap-2.5 mb-5">
                          <Clock size={17} className="flex-shrink-0 films-icon-color" />
                          <p className="text-white text-sm md:text-base font-medium">
                            Diffusion : {film.screening_time}
                          </p>
                        </div>
                      )}

                      {/* Synopsis */}
                      <p className="films-synopsis text-sm md:text-base leading-relaxed mb-6 line-clamp-4">
                        {synopsis}
                      </p>

                      <Link
                        href="/films"
                        className="self-start inline-flex items-center gap-1.5 font-medium transition-all text-sm films-more-link group-hover:gap-2.5"
                      >
                        {t("filmsSection.moreDetails", language)}
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA programme complet */}
        <div className="mt-12 md:mt-16 text-center">
          <Link href="/films">
            <button type="button" className="films-cta-btn px-8 md:px-12 py-3.5 md:py-4 rounded-xl font-medium text-sm md:text-base transition-all">
              {t("filmsSection.fullProgramCta", language)}
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
