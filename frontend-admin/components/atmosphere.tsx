"use client"

import { useEffect, useState } from "react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

export default function Atmosphere() {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useTheme()

  const activities = [
    {
      icon: "🎤",
      title: t("atmosphere.activities.dj.title", language),
      description: t("atmosphere.activities.dj.description", language),
    },
    {
      icon: "📸",
      title: t("atmosphere.activities.photos.title", language),
      description: t("atmosphere.activities.photos.description", language),
    },
    {
      icon: "🍟",
      title: t("atmosphere.activities.food.title", language),
      description: t("atmosphere.activities.food.description", language),
    },
    {
      icon: "🎁",
      title: t("atmosphere.activities.games.title", language),
      description: t("atmosphere.activities.games.description", language),
    },
    {
      /* Ajouter le bonus exclusif comme 5e activité */
      icon: "🔒",
      title: language === "fr" ? "Bonus exclusif" : "Exclusive Bonus",
      description:
        language === "fr"
          ? "Une animation spéciale sera dévoilée le jour J."
          : "A special animation will be revealed on the day.",
    },
  ]

  const photos = [
    { src: "/acte_2.jpg", caption: t("atmosphere.photos.p1", language) },
    { src: "/acte_2_1.jpg", caption: t("atmosphere.photos.p2", language) },
    { src: "/acte_4_2.jpg", caption: t("atmosphere.photos.p3", language) },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("atmosphere")
    if (element) observer.observe(element)
  }, [])

  return (
    <section id="atmosphere" className="w-full bg-[#0A0A0A] py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 md:mb-6 max-w-2xl mx-auto">
          {t("atmosphere.title", language)}
        </h2>

        {/* PHOTO GALLERY - Améliorer avec cadre arrondi et shadow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24 mt-12 md:mt-16 overflow-x-auto pb-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 flex-shrink-0 md:flex-shrink ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <img
                src={photo.src || "/placeholder.svg"}
                alt={photo.caption}
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500 rounded-2xl shadow-lg shadow-black/50"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-[#DC143C]/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 rounded-b-2xl">
                <p className="text-white font-medium text-sm md:text-base">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIVITIES GRID - Passer à 5 colonnes pour le bonus exclusif */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`bg-white/5 border border-white/10 rounded-2xl p-6 md:p-6 flex flex-col gap-4 transition-all duration-500 hover:border-[#DC143C]/50 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
              style={{ transitionDelay: `${(index + 3) * 0.1}s` }}
            >
              <div className="text-4xl">{activity.icon}</div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{activity.title}</h3>
                <p className="text-[#CCCCCC] leading-relaxed text-sm md:text-base">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-16 md:mt-20">
          <button className="border-2 border-white text-white px-8 md:px-12 py-3 md:py-4 rounded-lg font-medium hover:bg-white hover:text-black transition-all text-sm md:text-base">
            {t("atmosphere.cta", language)}
          </button>
        </div> */}
      </div>
    </section>
  )
}
