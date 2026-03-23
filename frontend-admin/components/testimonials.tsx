"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"


export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useTheme()


  // Testimonials récupérés depuis les traductions
  const testimonials = [
    {
      id: 1,
      rating: 5,
      quote: t("testimonials.items.t1.quote", language),
      author: t("testimonials.items.t1.author", language),
      pack: t("testimonials.items.t1.pack", language),
      edition: t("testimonials.items.t1.edition", language),
      photo: "/man-profile.jpg",
    },
    {
      id: 2,
      rating: 5,
      quote: t("testimonials.items.t2.quote", language),
      author: t("testimonials.items.t2.author", language),
      pack: t("testimonials.items.t2.pack", language),
      edition: t("testimonials.items.t2.edition", language),
      photo: "/dorian.jpg",
    },
    {
      id: 3,
      rating: 5,
      quote: t("testimonials.items.t3.quote", language),
      author: t("testimonials.items.t3.author", language),
      pack: t("testimonials.items.t3.pack", language),
      edition: t("testimonials.items.t3.edition", language),
      photo: "/sammy.jpg",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 },
    )
    const element = document.getElementById("testimonials")
    if (element) observer.observe(element)
  }, [])

  return (
    <section id="testimonials" className="w-full bg-[#F5F5F5] py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-6 md:mb-8">
          {t("testimonials.title", language)}
        </h2>

        {/* Overall Rating */}
        <div className="bg-white rounded-2xl p-8 mb-16 md:mb-20 text-center max-w-2xl mx-auto shadow-md">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={40} fill="#DC143C" className="text-[#DC143C]" />
            ))}
          </div>

          <p className="text-4xl font-bold text-black mb-2">
            {t("testimonials.overall.ratingValue", language)}
          </p>

          <p className="text-gray-600">
            {t("testimonials.overall.basedOn", language)}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="#DC143C" className="text-[#DC143C]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-800 italic mb-8 leading-relaxed min-h-24">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="border-t pt-6 flex items-center gap-4">
                <img
                  src={testimonial.photo}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full border-2 border-[#DC143C] object-cover"
                />
                <div>
                  <p className="font-bold text-black text-sm">{testimonial.author}</p>
                  <p className="text-gray-600 text-xs">
                    {testimonial.pack} • {testimonial.edition}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
