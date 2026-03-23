"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

// --------------------------------------------
// DATA (clean + i18n keys)
// --------------------------------------------
const editions = [
  {
    id: 1,
    year: 2024,
    date: "15 Décembre 2024",
    dateKey: "archivesPage.editions.e2024.date",
    location: "Musée National, Yaoundé",
    locationKey: "archivesPage.editions.e2024.location",
    films: ["Inception", "La La Land"],
    filmsKey: ["archivesPage.editions.e2024.film1", "archivesPage.editions.e2024.film2"],
    participants: 194,
    rating: 4.9,
    image: "/acte_4_2_c.jpg",
    highlightsKey: "archivesPage.editions.e2024.highlights",
  },
  {
    id: 2,
    year: 2023,
    date: "10 Novembre 2023",
    dateKey: "archivesPage.editions.e2023.date",
    location: "Musée National, Yaoundé",
    locationKey: "archivesPage.editions.e2023.location",
    films: ["Rêves sous les Étoiles", "La Nuit du Cinéma"],
    filmsKey: ["archivesPage.editions.e2023.film1", "archivesPage.editions.e2023.film2"],
    participants: 123,
    rating: 4.8,
    image: "/outdoor-cinema-night-event-2024.jpg",
    highlightsKey: "archivesPage.editions.e2023.highlights",
  },
  {
    id: 3,
    year: 2022,
    date: "22 Octobre 2022",
    dateKey: "archivesPage.editions.e2022.date",
    location: "Musée National, Yaoundé",
    locationKey: "archivesPage.editions.e2022.location",
    films: ["Le Voyage", "Lumières de la Nuit"],
    filmsKey: ["archivesPage.editions.e2022.film1", "archivesPage.editions.e2022.film2"],
    participants: 74,
    rating: 4.7,
    image: "/acte_2_1_c.jpg",
    highlightsKey: "archivesPage.editions.e2022.highlights",
  },
  {
    id: 4,
    year: 2021,
    date: "18 Septembre 2021",
    dateKey: "archivesPage.editions.e2021.date",
    location: "Musée National, Yaoundé",
    locationKey: "archivesPage.editions.e2021.location",
    films: ["Étoile Brillante", "Soirée Magique"],
    filmsKey: ["archivesPage.editions.e2021.film1", "archivesPage.editions.e2021.film2"],
    participants: 49,
    rating: 4.6,
    image: "/outdoor-cinema-night-event-2024.jpg",
    highlightsKey: "archivesPage.editions.e2021.highlights",
  },
]

export default function ArchivesPage() {
  const { language } = useTheme()
  const [selectedEdition, setSelectedEdition] = useState<(typeof editions)[0] | null>(null)

  return (
    <main className="w-full bg-[#0A0A0A]">
      <Header />

      <section className="pt-32 pb-16 px-4 md:px-6 max-w-6xl mx-auto">

        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {t("archivesPage.title", language)}
          </h1>
          <p className="text-xl text-[#CCCCCC]">
            {t("archivesPage.subtitle", language)}
          </p>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {editions.map((edition) => (
            <div
              key={edition.id}
              onClick={() => setSelectedEdition(edition)}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#DC143C]/50 transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={edition.image}
                  alt={`Movie in the Park ${edition.year}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-2">{edition.year}</h3>
                <p className="text-[#DC143C] font-medium mb-4">
                  {t(edition.dateKey, language)}
                </p>

                <div className="space-y-3 mb-6">
                  <p className="text-[#CCCCCC]">
                    <span className="font-semibold text-white">
                      {t("archivesPage.card.films", language)}:
                    </span>{" "}
                    {edition.films.join(", ")}
                  </p>
                  <p className="text-[#CCCCCC]">
                    <span className="font-semibold text-white">
                      {t("archivesPage.card.participants", language)}:
                    </span>{" "}
                    {edition.participants}+
                  </p>
                  <p className="flex items-center gap-2 text-yellow-400">
                    ⭐ {edition.rating}/5
                  </p>
                </div>

                <button
                  onClick={() => setSelectedEdition(edition)}
                  className="text-[#DC143C] font-medium hover:text-white transition-colors flex items-center gap-2"
                >
                  {t("archivesPage.card.seeDetails", language)} <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- MODAL DETAILS --- */}
        {selectedEdition && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-4xl font-bold text-white">
                    {t("archivesPage.modal.title", language).replace("{{year}}", selectedEdition.year.toString())}
                  </h2>
                  <button
                    onClick={() => setSelectedEdition(null)}
                    className="text-white hover:text-[#DC143C] text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <img
                    src={selectedEdition.image}
                    alt={`Movie in the Park ${selectedEdition.year}`}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />

                  <div className="space-y-4">

                    {/* Date */}
                    <div>
                      <p className="text-[#CCCCCC] text-sm font-semibold uppercase mb-1">
                        {t("archivesPage.modal.dateLabel", language)}
                      </p>
                      <p className="text-white text-lg">
                        {t(selectedEdition.dateKey, language)}
                      </p>
                    </div>

                    {/* Location */}
                    <div>
                      <p className="text-[#CCCCCC] text-sm font-semibold uppercase mb-1">
                        {t("archivesPage.modal.locationLabel", language)}
                      </p>
                      <p className="text-white text-lg">
                        {t(selectedEdition.locationKey, language)}
                      </p>
                    </div>

                    {/* Films */}
                    <div>
                      <p className="text-[#CCCCCC] text-sm font-semibold uppercase mb-1">
                        {t("archivesPage.modal.filmsLabel", language)}
                      </p>
                      <ul className="text-white space-y-2">
                        {selectedEdition.films.map((film, idx) => (
                          <li key={film} className="flex items-center gap-2">
                            <span className="text-[#DC143C]">•</span>{" "}
                            {t(selectedEdition.filmsKey[idx], language)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Highlights */}
                    <div>
                      <p className="text-[#CCCCCC] text-sm font-semibold uppercase mb-1">
                        {t("archivesPage.modal.highlightsLabel", language)}
                      </p>
                      <p className="text-white">
                        {t(selectedEdition.highlightsKey, language)}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="pt-6 border-t border-white/10 flex gap-4">
                      <Link href="/reservation" className="flex-1">
                        <button className="w-full bg-[#DC143C] hover:bg-[#8B0000] text-white px-6 py-3 rounded-lg font-bold transition-all">
                          {t("archivesPage.modal.cta", language)}
                        </button>
                      </Link>

                      <button
                        onClick={() => setSelectedEdition(null)}
                        className="flex-1 border-2 border-white/20 text-white hover:border-[#DC143C] px-6 py-3 rounded-lg font-bold transition-all"
                      >
                        {t("archivesPage.modal.close", language)}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- FINAL CTA --- */}
        <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t("archivesPage.finalCTA.title", language)}
          </h2>
          <p className="text-xl text-[#CCCCCC] mb-8">
            {t("archivesPage.finalCTA.subtitle", language)}
          </p>

          <Link href="/reservation">
            <button className="bg-[#8B0000] hover:bg-[#DC143C] text-white px-12 py-4 rounded-lg font-bold transition-all hover:scale-105 shadow-lg shadow-red-950/50">
              {t("archivesPage.finalCTA.button", language)}
            </button>
          </Link>
        </div>

      </section>

      <Footer />
    </main>
  )
}
