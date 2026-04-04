"use client"

import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

const PHOTO_DELAYS  = ["anim-delay-0", "anim-delay-150", "anim-delay-300"]
const ACTIVITY_DELAYS = ["anim-delay-300", "anim-delay-400", "anim-delay-500", "anim-delay-600", "anim-delay-800"]

export default function Atmosphere() {
  const { language } = useTheme()

  const activities = [
    { icon: "🎤", title: t("atmosphere.activities.dj.title",     language), description: t("atmosphere.activities.dj.description",     language) },
    { icon: "📸", title: t("atmosphere.activities.photos.title",  language), description: t("atmosphere.activities.photos.description",  language) },
    { icon: "🍟", title: t("atmosphere.activities.food.title",    language), description: t("atmosphere.activities.food.description",    language) },
    { icon: "🎁", title: t("atmosphere.activities.games.title",   language), description: t("atmosphere.activities.games.description",   language) },
    {
      icon: "🔒",
      title:       language === "fr" ? "Bonus exclusif" : "Exclusive Bonus",
      description: language === "fr"
        ? "Une animation spéciale sera dévoilée le jour J."
        : "A special animation will be revealed on the day.",
    },
  ]

  const photos = [
    { src: "/acte_2.jpg",   caption: t("atmosphere.photos.p1", language) },
    { src: "/acte_2_1.jpg", caption: t("atmosphere.photos.p2", language) },
    { src: "/acte_4_2.jpg", caption: t("atmosphere.photos.p3", language) },
  ]

  return (
    <section id="atmosphere" className="atmosphere-root w-full py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 md:mb-6 max-w-2xl mx-auto">
          {t("atmosphere.title", language)}
        </h2>

        {/* Galerie photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24 mt-12 md:mt-16 overflow-x-auto pb-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`atmosphere-photo-card relative rounded-2xl overflow-hidden group cursor-pointer animate-fade-in-up flex-shrink-0 md:flex-shrink ${PHOTO_DELAYS[index]}`}
            >
              <img
                src={photo.src || "/placeholder.svg"}
                alt={photo.caption}
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500 rounded-2xl"
              />
              <div className="atmosphere-photo-overlay absolute inset-0 transition-colors duration-300" />
              <div className="atmosphere-photo-caption absolute bottom-0 left-0 right-0 p-4 rounded-b-2xl">
                <p className="text-white font-medium text-sm md:text-base">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Grille activités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`atmosphere-activity-card rounded-2xl p-6 flex flex-col gap-4 animate-fade-in-up ${ACTIVITY_DELAYS[index]}`}
            >
              <div className="text-4xl">{activity.icon}</div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{activity.title}</h3>
                <p className="atmosphere-activity-desc leading-relaxed text-sm md:text-base">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
