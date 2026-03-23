"use client"

import { useEffect, useState } from "react"
import { Clapperboard, Popcorn, Users, Star } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"

export default function WhyCome() {
  const [isVisible, setIsVisible] = useState(false)
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById("why-come")
    if (element) observer.observe(element)
  }, [])

  return (
    <section id="why-come" className="w-full bg-[#F5F5F5] py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-4 md:mb-6">
          {t("whyCome.title", language)}
        </h2>

        {/* SUBTITLE */}
        <p className="text-center text-gray-600 mb-16 md:mb-24 text-lg max-w-2xl mx-auto">
          {t("whyCome.subtitle", language)}
        </p>

        {/* BENEFITS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 
                transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-6">
                  <Icon size={64} className="text-[#DC143C]" />
                </div>

                <h3 className="text-2xl font-bold text-black text-center mb-4">{benefit.title}</h3>
                <p className="text-gray-700 text-center leading-relaxed">
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
