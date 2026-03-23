"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"

const filmsMeta = [
  {
    id: 1,
    key: "filmsList.horror",
    poster: "/saw.jpeg",
  },
  {
    id: 2,
    key: "filmsList.family",
    poster: "/zootopie.jpeg",
  },
]

export default function Films() {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useTheme()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("films")
    if (element) {
      observer.observe(element)
    }
  }, [])

  return (
    <section id="films" className="w-full bg-[#0A0A0A] py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* TITRE */}
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-3 md:mb-4">
          {t("filmsSection.title", language)}
        </h2>

        <p className="text-center text-[#CCCCCC] mb-12 md:mb-16 text-base md:text-lg max-w-2xl mx-auto">
          Deux films soigneusement sélectionnés pour une soirée inoubliable.
        </p>

        {/* CARTES FILMS */}
        <div className="space-y-10 md:space-y-12">
          {filmsMeta.map((film, index) => {
            const title = t(`${film.key}.title`, language)
            const genre = t(`${film.key}.genre`, language)
            const year = t(`${film.key}.year`, language)
            const country = t(`${film.key}.country`, language)
            const time = t(`${film.key}.time`, language)
            const synopsis = t(`${film.key}.synopsis`, language)

            return (
              <div
                key={film.id}
                className={`bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#DC143C]/50 transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={film.poster || "/placeholder.svg"}
                      alt={title}
                      className="w-full md:w-72 h-auto rounded-xl shadow-2xl object-cover"
                    />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">{title}</h3>

                    <p className="text-[#DC143C] text-base md:text-lg font-medium mb-4">
                      {genre} • {year} • {country}
                    </p>

                    <div className="flex items-center gap-3 mb-6">
                      <Clock size={20} className="text-[#DC143C]" />
                      <p className="text-white text-base md:text-lg font-medium">Diffusion : {time}</p>
                    </div>

                    <p className="text-[#CCCCCC] text-base md:text-lg leading-relaxed mb-6 line-clamp-4">{synopsis}</p>

                    <Link
                      href="/films"
                      className="self-start text-[#DC143C] font-medium hover:underline transition-colors text-sm md:text-base"
                    >
                      {t("filmsSection.moreDetails", language)}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* BOUTON PROGRAMME COMPLET */}
        <div className="mt-12 md:mt-16 text-center">
          <Link href="/films">
            <button className="border-2 border-[#DC143C] text-white px-8 md:px-12 py-3 md:py-4 rounded-lg font-medium hover:bg-[#DC143C] hover:text-black transition-all text-sm md:text-base">
              {t("filmsSection.fullProgramCta", language)}
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
