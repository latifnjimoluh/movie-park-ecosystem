"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FilmDetail from "@/components/film-detail"
import Schedule from "@/components/schedule"
import Activities from "@/components/activities"
import Link from "next/link"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

export default function FilmsPage() {
  const { language } = useTheme()

  const films = [
    {
      id: 1,
      title: t("filmsPage.films.f1.title", language),
      genre: t("filmsPage.films.f1.genre", language),
      country: t("filmsPage.films.f1.country", language),
      year: t("filmsPage.films.f1.year", language),
      duration: t("filmsPage.films.f1.duration", language),
      classification: t("filmsPage.films.f1.classification", language),
      synopsys: t("filmsPage.films.f1.synopsis", language),
      poster: "/zootopie.jpeg",
      youtubeUrl: "#",
      screeningTime: t("filmsPage.films.f1.screening", language),
    },
    {
      id: 2,
      title: t("filmsPage.films.f2.title", language),
      genre: t("filmsPage.films.f2.genre", language),
      country: t("filmsPage.films.f2.country", language),
      year: t("filmsPage.films.f2.year", language),
      duration: t("filmsPage.films.f2.duration", language),
      classification: t("filmsPage.films.f2.classification", language),
      synopsys: t("filmsPage.films.f2.synopsis", language),
      poster: "/saw.jpeg",
      youtubeUrl: "#",
      screeningTime: t("filmsPage.films.f2.screening", language),
    },
  ]

  const scheduleItems = [
    {
      time: t("filmsPage.schedule.s1.time", language),
      title: t("filmsPage.schedule.s1.title", language),
      description: t("filmsPage.schedule.s1.description", language),
    },
    {
      time: t("filmsPage.schedule.s2.time", language),
      title: t("filmsPage.schedule.s2.title", language),
      description: t("filmsPage.schedule.s2.description", language),
    },
    {
      time: t("filmsPage.schedule.s3.time", language),
      title: t("filmsPage.schedule.s3.title", language),
      description: t("filmsPage.schedule.s3.description", language),
    },
    {
      time: t("filmsPage.schedule.s4.time", language),
      title: t("filmsPage.schedule.s4.title", language),
      description: t("filmsPage.schedule.s4.description", language),
    },
    {
      time: t("filmsPage.schedule.s5.time", language),
      title: t("filmsPage.schedule.s5.title", language),
      description: t("filmsPage.schedule.s5.description", language),
      isTeaser: true,
      isSurprise: true,
      isAfter: true,
    },
    {
      time: t("filmsPage.schedule.s6.time", language),
      title: t("filmsPage.schedule.s6.title", language),
      description: t("filmsPage.schedule.s6.description", language),
    },
  ]

  return (
    <main className="w-full">
      <Header />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#1a0a0a] pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-[#f8f8f8] mb-4">
            {t("filmsPage.header.title", language)}
          </h1>
          <p className="text-xl text-[#cccccc]">{t("filmsPage.header.subtitle", language)}</p>
        </div>
      </section>

      {/* Films Details */}
      <section className="bg-[#0a0a0a] py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-16 md:space-y-20">
          {films.map((film) => (
            <FilmDetail key={film.id} film={film} />
          ))}
        </div>
      </section>

      {/* Schedule Section */}
      <section className="bg-[#121212] py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f8f8f8] mb-3 md:mb-4">
              {t("filmsPage.schedule.title", language)}
            </h2>
            <p className="text-base md:text-lg text-[#cccccc]">{t("filmsPage.schedule.subtitle", language)}</p>
          </div>
          <Schedule items={scheduleItems} />
        </div>
      </section>

      {/* Activities Section */}
      <section className="bg-[#0a0a0a] py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#f8f8f8] mb-12 md:mb-16">
            {t("filmsPage.activitiesSection.title", language)}
          </h2>
          <Activities />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#a00000] to-[#cc0000] py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            {t("filmsPage.cta.title", language)}
          </h2>

          <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            {t("filmsPage.cta.subtitle", language)}
          </p>

          <Link
            href="/reservation"
            className="inline-block bg-[#0a0a0a] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-[#1a1a1a] transition-colors text-sm md:text-base"
          >
            {t("filmsPage.cta.button", language)}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
