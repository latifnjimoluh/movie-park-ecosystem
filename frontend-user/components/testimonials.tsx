"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import {
  fetchTestimonials,
  testimonialQuote,
  resolveImageUrl,
  type DbTestimonial,
  FALLBACK_TESTIMONIALS,
} from "@/lib/content-service"

/* Délais d'entrée pour les cartes */
const CARD_DELAYS = ["anim-delay-0", "anim-delay-150", "anim-delay-300"]

export default function Testimonials() {
  const { language }                        = useTheme()
  const [testimonials, setTestimonials]     = useState<DbTestimonial[]>(FALLBACK_TESTIMONIALS)
  const [isLoading, setIsLoading]           = useState(true)

  useEffect(() => {
    fetchTestimonials().then(({ testimonials: data }) => {
      setTestimonials(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <section id="testimonials" className="testimonials-root w-full py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Badge + Titre */}
        <div className="text-center mb-10 md:mb-12">
          <span className="testimonials-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            🌸 Témoignages
          </span>
          <h2 className="testimonials-title text-4xl md:text-5xl font-bold mb-2">
            {t("testimonials.title", language)}
          </h2>
        </div>

        {/* Note globale */}
        <div className="testimonials-rating-card mb-16 md:mb-20">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={40} fill="#F59E0B" className="text-[#F59E0B]" />
            ))}
          </div>
          <p className="testimonials-rating-value text-4xl font-bold mb-2">
            {t("testimonials.overall.ratingValue", language)}
          </p>
          <p className="testimonials-rating-label">
            {t("testimonials.overall.basedOn", language)}
          </p>
        </div>

        {/* Chargement */}
        {isLoading && (
          <div className="text-center py-10 testimonials-rating-label">
            Chargement des témoignages…
          </div>
        )}

        {/* Grille des témoignages */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonials-card animate-fade-in-up ${CARD_DELAYS[index] ?? "anim-delay-300"}`}
              >
                {/* Étoiles */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#F59E0B" className="text-[#F59E0B]" />
                  ))}
                </div>

                {/* Citation */}
                <p className="testimonials-quote italic mb-8 leading-relaxed min-h-24">
                  &ldquo;{testimonialQuote(testimonial, language)}&rdquo;
                </p>

                {/* Auteur */}
                <div className="border-t border-purple-100 pt-6 flex items-center gap-4">
                  <img
                    src={resolveImageUrl(testimonial)}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full border-2 border-[#7C3AED] object-cover"
                  />
                  <div>
                    <p className="testimonials-author-name font-bold text-sm">{testimonial.author}</p>
                    <p className="testimonials-author-meta text-xs">
                      {testimonial.pack_name} • {testimonial.edition}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
