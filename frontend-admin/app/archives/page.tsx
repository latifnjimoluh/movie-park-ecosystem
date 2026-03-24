"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

const editions = [
  {
    id: 1, year: 2024, dateKey: "archivesPage.editions.e2024.date", locationKey: "archivesPage.editions.e2024.location",
    films: ["Inception", "La La Land"],
    filmsKey: ["archivesPage.editions.e2024.film1", "archivesPage.editions.e2024.film2"],
    participants: 194, rating: 4.9, image: "/acte_4_2_c.jpg", highlightsKey: "archivesPage.editions.e2024.highlights",
  },
  {
    id: 2, year: 2023, dateKey: "archivesPage.editions.e2023.date", locationKey: "archivesPage.editions.e2023.location",
    films: ["Rêves sous les Étoiles", "La Nuit du Cinéma"],
    filmsKey: ["archivesPage.editions.e2023.film1", "archivesPage.editions.e2023.film2"],
    participants: 123, rating: 4.8, image: "/outdoor-cinema-night-event-2024.jpg", highlightsKey: "archivesPage.editions.e2023.highlights",
  },
  {
    id: 3, year: 2022, dateKey: "archivesPage.editions.e2022.date", locationKey: "archivesPage.editions.e2022.location",
    films: ["Le Voyage", "Lumières de la Nuit"],
    filmsKey: ["archivesPage.editions.e2022.film1", "archivesPage.editions.e2022.film2"],
    participants: 74, rating: 4.7, image: "/acte_2_1_c.jpg", highlightsKey: "archivesPage.editions.e2022.highlights",
  },
  {
    id: 4, year: 2021, dateKey: "archivesPage.editions.e2021.date", locationKey: "archivesPage.editions.e2021.location",
    films: ["Étoile Brillante", "Soirée Magique"],
    filmsKey: ["archivesPage.editions.e2021.film1", "archivesPage.editions.e2021.film2"],
    participants: 49, rating: 4.6, image: "/outdoor-cinema-night-event-2024.jpg", highlightsKey: "archivesPage.editions.e2021.highlights",
  },
]

export default function ArchivesPage() {
  const { language }       = useTheme()
  const [selected, setSelected] = useState<(typeof editions)[0] | null>(null)

  return (
    <main className="page-root w-full">
      <Header />

      <section className="pt-32 pb-16 px-4 md:px-6 max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-16">
          <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            📜 Archives
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {t("archivesPage.title", language)}
          </h1>
          <p className="films-desc text-xl">{t("archivesPage.subtitle", language)}</p>
        </div>

        {/* Grille éditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {editions.map((edition) => (
            <div
              key={edition.id}
              onClick={() => setSelected(edition)}
              className="archives-card rounded-2xl overflow-hidden transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={edition.image}
                  alt={`Movie in the Park ${edition.year}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="archives-card-image-overlay absolute inset-0" />
              </div>

              <div className="archives-card-body p-8">
                <h3 className="text-3xl font-bold text-white mb-2">{edition.year}</h3>
                <p className="archives-card-date font-medium mb-4">{t(edition.dateKey, language)}</p>

                <div className="space-y-3 mb-6">
                  <p className="films-desc">
                    <span className="font-semibold text-white">{t("archivesPage.card.films", language)}:</span>{" "}
                    {edition.films.join(", ")}
                  </p>
                  <p className="films-desc">
                    <span className="font-semibold text-white">{t("archivesPage.card.participants", language)}:</span>{" "}
                    {edition.participants}+
                  </p>
                  <p className="flex items-center gap-2 text-[#F59E0B]">⭐ {edition.rating}/5</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(edition)}
                  className="archives-card-link font-medium flex items-center gap-2 transition-colors"
                >
                  {t("archivesPage.card.seeDetails", language)} <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal détails */}
        {selected && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="archives-modal rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-4xl font-bold text-white">
                    {t("archivesPage.modal.title", language).replace("{{year}}", selected.year.toString())}
                  </h2>
                  <button type="button" onClick={() => setSelected(null)} className="archives-modal-close text-2xl">✕</button>
                </div>

                <img src={selected.image} alt={`Movie in the Park ${selected.year}`} className="w-full h-64 object-cover rounded-xl mb-6" />

                <div className="space-y-4">
                  <div>
                    <p className="archives-modal-label text-sm font-semibold uppercase mb-1">{t("archivesPage.modal.dateLabel", language)}</p>
                    <p className="text-white text-lg">{t(selected.dateKey, language)}</p>
                  </div>
                  <div>
                    <p className="archives-modal-label text-sm font-semibold uppercase mb-1">{t("archivesPage.modal.locationLabel", language)}</p>
                    <p className="text-white text-lg">{t(selected.locationKey, language)}</p>
                  </div>
                  <div>
                    <p className="archives-modal-label text-sm font-semibold uppercase mb-1">{t("archivesPage.modal.filmsLabel", language)}</p>
                    <ul className="text-white space-y-2">
                      {selected.films.map((film, idx) => (
                        <li key={film} className="flex items-center gap-2">
                          <span className="text-[#A78BFA]">•</span>{" "}
                          {t(selected.filmsKey[idx], language)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="archives-modal-label text-sm font-semibold uppercase mb-1">{t("archivesPage.modal.highlightsLabel", language)}</p>
                    <p className="text-white">{t(selected.highlightsKey, language)}</p>
                  </div>

                  <div className="pt-6 archives-modal-footer flex gap-4">
                    <Link href="/reservation" className="flex-1">
                      <button type="button" className="w-full header-cta-btn py-3 rounded-lg font-bold">
                        {t("archivesPage.modal.cta", language)}
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="flex-1 archives-modal-close-btn py-3 rounded-lg font-bold transition-all"
                    >
                      {t("archivesPage.modal.close", language)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA final */}
        <div className="archives-final-cta text-center rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">{t("archivesPage.finalCTA.title", language)}</h2>
          <p className="films-desc text-xl mb-8">{t("archivesPage.finalCTA.subtitle", language)}</p>
          <Link href="/reservation">
            <button type="button" className="header-cta-btn px-12 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
              {t("archivesPage.finalCTA.button", language)}
            </button>
          </Link>
        </div>

      </section>

      <Footer />
    </main>
  )
}
