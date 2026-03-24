"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FilmDetail from "@/components/film-detail"
import Schedule from "@/components/schedule"
import Activities from "@/components/activities"
import Link from "next/link"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import {
  fetchFilms,
  fetchSchedule,
  filmTitle,
  filmGenre,
  filmCountry,
  filmSynopsis,
  filmClassification,
  scheduleTitle,
  scheduleDescription,
  type DbFilm,
  type DbScheduleItem,
  FALLBACK_FILMS,
  FALLBACK_SCHEDULE,
} from "@/lib/content-service"

function toFilmDetailProps(film: DbFilm, lang: string) {
  return {
    id: Number(film.id),
    title: filmTitle(film, lang),
    genre: filmGenre(film, lang),
    country: filmCountry(film, lang),
    year: film.year ?? 0,
    duration: film.duration ?? "",
    classification: filmClassification(film, lang),
    synopsys: filmSynopsis(film, lang),
    poster: film.poster_url ?? "/placeholder.svg",
    youtubeUrl: film.youtube_url ?? "#",
    screeningTime: film.screening_time ?? "",
  }
}

function toScheduleItemProps(item: DbScheduleItem, lang: string) {
  return {
    time: item.time,
    title: scheduleTitle(item, lang),
    description: scheduleDescription(item, lang),
    isSurprise: item.is_surprise,
    isAfter: item.is_after,
    isTeaser: item.is_teaser,
  }
}

export default function FilmsPage() {
  const { language }                          = useTheme()
  const [films, setFilms]                     = useState<DbFilm[]>(FALLBACK_FILMS)
  const [scheduleItems, setScheduleItems]     = useState<DbScheduleItem[]>(FALLBACK_SCHEDULE)
  const [isLoading, setIsLoading]             = useState(true)

  useEffect(() => {
    Promise.all([fetchFilms(), fetchSchedule()]).then(([filmsResult, scheduleResult]) => {
      setFilms(filmsResult.films)
      setScheduleItems(scheduleResult.items)
      setIsLoading(false)
    })
  }, [])

  return (
    <main className="w-full">
      <Header />

      {/* Hero de la page films */}
      <section className="page-hero pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            🎬 {t("filmsPage.header.title", language)}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {t("filmsPage.header.title", language)}
          </h1>
          <p className="films-desc text-xl">{t("filmsPage.header.subtitle", language)}</p>
        </div>
      </section>

      {/* Détails des films */}
      <section className="page-section py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-16 md:space-y-20">
          {isLoading ? (
            <div className="films-loading text-center py-10">
              <span className="animate-dove-flutter inline-block text-xl mr-2">🕊️</span>
              Chargement des films…
            </div>
          ) : (
            films.map((film) => (
              <FilmDetail key={film.id} film={toFilmDetailProps(film, language)} />
            ))
          )}
        </div>
      </section>

      {/* Programme */}
      <section className="page-section-alt py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              {t("filmsPage.schedule.title", language)}
            </h2>
            <p className="films-desc text-base md:text-lg">{t("filmsPage.schedule.subtitle", language)}</p>
          </div>
          {isLoading ? (
            <div className="films-loading text-center py-10">Chargement du programme…</div>
          ) : (
            <Schedule items={scheduleItems.map((item) => toScheduleItemProps(item, language))} />
          )}
        </div>
      </section>

      {/* Activités */}
      <section className="page-section py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16">
            {t("filmsPage.activitiesSection.title", language)}
          </h2>
          <Activities />
        </div>
      </section>

      {/* CTA Réservation */}
      <section className="page-cta-section py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            {t("filmsPage.cta.title", language)}
          </h2>
          <p className="text-base md:text-lg text-white/85 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            {t("filmsPage.cta.subtitle", language)}
          </p>
          <Link
            href="/reservation"
            className="inline-block page-cta-btn px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all text-sm md:text-base"
          >
            {t("filmsPage.cta.button", language)}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
