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

      {/* Affiche */}
      <div className="md:col-span-1">
        <img
          src={film.poster || "/placeholder.svg"}
          alt={`${film.title} - Affiche`}
          className="film-detail-poster w-full rounded-xl shadow-2xl transition-all duration-300"
        />
      </div>

      {/* Détails */}
      <div className="md:col-span-2">
        <h3 className="film-detail-title text-4xl font-bold mb-4">{film.title}</h3>

        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap gap-4 film-detail-meta">
            <div><span className="film-detail-label font-semibold">Genre :</span> {film.genre}</div>
            <div><span className="film-detail-label font-semibold">Pays :</span> {film.country}</div>
            <div><span className="film-detail-label font-semibold">Année :</span> {film.year}</div>
          </div>

          <div className="flex flex-wrap gap-4 film-detail-meta">
            <div><span className="film-detail-label font-semibold">Durée :</span> {film.duration}</div>
            <div><span className="film-detail-label font-semibold">Classification :</span> {film.classification}</div>
          </div>

          <div className="film-detail-screening text-3xl font-bold pt-2">
            Projection à {film.screeningTime}
          </div>
        </div>

        <p className="film-detail-synopsis text-lg leading-relaxed mb-8">{film.synopsys}</p>

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
