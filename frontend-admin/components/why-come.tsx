"use client"

import { Clapperboard, Popcorn, Users, Star } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"

export default function WhyCome() {
  const { language } = useTheme()

  const benefits = [
    {
      icon: Clapperboard,
      title: t("whyCome.item1_title", language),
      description: t("whyCome.item1_desc", language),
    },
    {
      icon: Popcorn,
      title: t("whyCome.item2_title", language),
      description: t("whyCome.item2_desc", language),
    },
    {
      icon: Users,
      title: t("whyCome.item3_title", language),
      description: t("whyCome.item3_desc", language),
    },
    {
      icon: Star,
      title: t("whyCome.item4_title", language),
      description: t("whyCome.item4_desc", language),
    },
  ]

  return (
    <section
      id="why-come"
      className="w-full py-20 md:py-28 px-4 md:px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0E0E1A 0%, #080810 100%)" }}
    >
      {/* Subtle mint orb */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <span
            className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              border: "1px solid rgba(250,204,21,0.35)",
              background: "rgba(250,204,21,0.07)",
              color: "#FACC15",
            }}
          >
            ✨ L&apos;expérience
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("whyCome.title", language)}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#CCCCBB" }}>
            {t("whyCome.subtitle", language)}
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="group rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.12}s`,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(250,204,21,0.35)"
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 30px rgba(250,204,21,0.1), 0 4px 20px rgba(0,0,0,0.4)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)"
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"
                }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300"
                  style={{ background: "rgba(250,204,21,0.1)" }}
                >
                  <Icon size={32} style={{ color: "#FACC15" }} />
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-center leading-relaxed" style={{ color: "#CCCCBB" }}>
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
