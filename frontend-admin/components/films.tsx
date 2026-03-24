"use client"

import { Clock, Globe, Calendar } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"

const filmsMeta = [
  { id: 1, key: "filmsList.horror", poster: "/saw.jpeg" },
  { id: 2, key: "filmsList.family", poster: "/zootopie.jpeg" },
]

export default function Films() {
  const { language } = useTheme()

  return (
    <section
      id="films"
      className="w-full py-16 md:py-24 px-4 md:px-6 relative overflow-hidden"
      style={{ background: "#080810" }}
    >
      {/* Mint accent orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16,185,129,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span
            className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              border: "1px solid rgba(16,185,129,0.4)",
              background: "rgba(16,185,129,0.08)",
              color: "#10B981",
            }}
          >
            🎬 Programme Pâques 2026
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            {t("filmsSection.title", language)}
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#CCCCBB" }}>
            Deux films soigneusement sélectionnés pour une soirée inoubliable.
          </p>
        </div>

        {/* Film cards */}
        <div className="space-y-8 md:space-y-10">
          {filmsMeta.map((film, index) => {
            const title    = t(`${film.key}.title`,    language)
            const genre    = t(`${film.key}.genre`,    language)
            const year     = t(`${film.key}.year`,     language)
            const country  = t(`${film.key}.country`,  language)
            const time     = t(`${film.key}.time`,     language)
            const synopsis = t(`${film.key}.synopsis`, language)

            return (
              <div
                key={film.id}
                className="group relative rounded-2xl overflow-hidden animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.35)",
                }}
              >
                {/* Golden neon glow on hover — purely CSS, no JS */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl"
                  style={{
                    border: "1px solid rgba(250,204,21,0.55)",
                    boxShadow:
                      "0 0 25px rgba(250,204,21,0.18), 0 0 60px rgba(250,204,21,0.06), inset 0 0 25px rgba(250,204,21,0.04)",
                  }}
                />

                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-7 md:gap-10">
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <div className="relative overflow-hidden rounded-xl w-full md:w-56">
                      <img
                        src={film.poster || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ aspectRatio: "2/3", objectFit: "cover" }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(8,8,16,0.6) 0%, transparent 40%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">{title}</h3>

                    {/* Genre badges */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: "rgba(250,204,21,0.12)",
                          border: "1px solid rgba(250,204,21,0.3)",
                          color: "#FACC15",
                        }}
                      >
                        {genre}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#CCCCBB",
                        }}
                      >
                        <Calendar size={11} />
                        {year}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: "rgba(16,185,129,0.08)",
                          border: "1px solid rgba(16,185,129,0.25)",
                          color: "#10B981",
                        }}
                      >
                        <Globe size={11} />
                        {country}
                      </span>
                    </div>

                    {/* Diffusion time */}
                    <div className="flex items-center gap-2.5 mb-5">
                      <Clock size={17} className="flex-shrink-0" style={{ color: "#FACC15" }} />
                      <p className="text-white text-sm md:text-base font-medium">
                        Diffusion : {time}
                      </p>
                    </div>

                    {/* Synopsis */}
                    <p
                      className="text-sm md:text-base leading-relaxed mb-6 line-clamp-4"
                      style={{ color: "#CCCCBB" }}
                    >
                      {synopsis}
                    </p>

                    <Link
                      href="/films"
                      className="self-start inline-flex items-center gap-1.5 font-medium transition-all text-sm group-hover:gap-2.5 hover:underline underline-offset-2"
                      style={{ color: "#FACC15" }}
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

        {/* Full program CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <Link href="/films">
            <button
              className="px-8 md:px-12 py-3.5 md:py-4 rounded-xl font-medium text-sm md:text-base transition-all"
              style={{
                border: "1px solid rgba(250,204,21,0.45)",
                color: "#FACC15",
                background: "rgba(250,204,21,0.05)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "#FACC15"
                ;(e.currentTarget as HTMLButtonElement).style.color = "#080810"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "#FACC15"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(250,204,21,0.05)"
                ;(e.currentTarget as HTMLButtonElement).style.color = "#FACC15"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(250,204,21,0.45)"
              }}
            >
              {t("filmsSection.fullProgramCta", language)}
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
