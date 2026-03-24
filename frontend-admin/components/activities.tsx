"use client"

import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

export default function Activities() {
  const { language } = useTheme()

  const activities = [
    {
      icon: "🎤",
      title: t("activities.a1.title", language),
      description: t("activities.a1.description", language),
    },
    {
      icon: "📸",
      title: t("activities.a2.title", language),
      description: t("activities.a2.description", language),
    },
    {
      icon: "🍟",
      title: t("activities.a3.title", language),
      description: t("activities.a3.description", language),
    },
    {
      icon: "🎁",
      title: t("activities.a4.title", language),
      description: t("activities.a4.description", language),
    },
    {
      icon: "🔒",
      title: t("activities.a5.title", language),
      description: t("activities.a5.description", language),
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="bg-[#121212] rounded-lg p-8 hover:bg-[#1a1a1a] transition-all duration-300 hover:shadow-lg hover:shadow-[#854D0E]/20"
        >
          <div className="text-5xl mb-4">{activity.icon}</div>
          <h4 className="text-xl font-bold text-[#f8f8f8] mb-3">{activity.title}</h4>
          <p className="text-[#cccccc] leading-relaxed">{activity.description}</p>
        </div>
      ))}
    </div>
  )
}
