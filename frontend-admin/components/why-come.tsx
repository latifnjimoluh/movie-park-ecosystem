"use client"

import { Clapperboard, Popcorn, Users, Star } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"

const BENEFIT_DELAYS = ["anim-delay-0", "anim-delay-120", "anim-delay-200", "anim-delay-300"]

export default function WhyCome() {
  const { language } = useTheme()

  const benefits = [
    { icon: Clapperboard, title: t("whyCome.item1_title", language), description: t("whyCome.item1_desc", language) },
    { icon: Popcorn,      title: t("whyCome.item2_title", language), description: t("whyCome.item2_desc", language) },
    { icon: Users,        title: t("whyCome.item3_title", language), description: t("whyCome.item3_desc", language) },
    { icon: Star,         title: t("whyCome.item4_title", language), description: t("whyCome.item4_desc", language) },
  ]

  return (
    <section id="why-come" className="whycome-root w-full py-20 md:py-28 px-4 md:px-6 relative overflow-hidden">
      <div className="whycome-orb absolute bottom-0 right-0 w-96 h-96 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14 md:mb-20">
          <span className="whycome-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
            ✨ L&apos;expérience
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("whyCome.title", language)}
          </h2>
          <p className="whycome-subtitle text-lg max-w-2xl mx-auto">
            {t("whyCome.subtitle", language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className={`whycome-card group rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up ${BENEFIT_DELAYS[index]}`}
              >
                <div className="whycome-icon-wrap w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Icon size={32} className="text-[#A78BFA]" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">{benefit.title}</h3>
                <p className="whycome-desc text-sm text-center leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
