"use client"

import { useState } from "react"

interface Film {
  id: number
  title: string
  genre: string
  country: string
  year: number
  duration: string
  classification: string
  synopsys: string
  poster: string
  youtubeUrl: string
  screeningTime: string
}

export default function FilmDetail({ film }: { film: Film }) {
  const [showTrailer, setShowTrailer] = useState(false)

  return (
    <div className="grid md:grid-cols-3 gap-12 items-start">
      {/* Poster */}
      <div className="md:col-span-1">
        <img
          src={film.poster || "/placeholder.svg"}
          alt={`${film.title} - Affiche`}
          className="w-full rounded-lg shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
        />
      </div>

      {/* Film Details */}
      <div className="md:col-span-2">
        <h3 className="text-4xl font-bold text-[#f8f8f8] mb-4">{film.title}</h3>

        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap gap-4 text-[#cccccc]">
            <div>
              <span className="text-[#854D0E] font-semibold">Genre:</span> {film.genre}
            </div>
            <div>
              <span className="text-[#854D0E] font-semibold">Pays:</span> {film.country}
            </div>
            <div>
              <span className="text-[#854D0E] font-semibold">Année:</span> {film.year}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-[#cccccc]">
            <div>
              <span className="text-[#854D0E] font-semibold">Durée:</span> {film.duration}
            </div>
            <div>
              <span className="text-[#854D0E] font-semibold">Classification:</span> {film.classification}
            </div>
          </div>

          <div className="text-3xl font-bold text-[#FACC15] pt-2">Projection à {film.screeningTime}</div>
        </div>

        <p className="text-lg text-[#cccccc] leading-relaxed mb-8">{film.synopsys}</p>

        {/* <button
          onClick={() => setShowTrailer(!showTrailer)}
          className="bg-[#854D0E] hover:bg-[#cc0000] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {showTrailer ? "Masquer la bande-annonce" : "Voir la bande-annonce"}
        </button> */}

        {showTrailer && (
          <div className="mt-8 rounded-lg overflow-hidden shadow-xl">
            <iframe
              width="100%"
              height="400"
              src={film.youtubeUrl}
              title={`${film.title} - Bande-annonce`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}
