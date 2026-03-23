"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Film, Users, Trophy, Zap } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

export default function AboutPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const { language } = useTheme()

  const faqItems = [
    { q: "aboutPage.faq.q1", a: "aboutPage.faq.a1" },
    { q: "aboutPage.faq.q2", a: "aboutPage.faq.a2" },
    { q: "aboutPage.faq.q3", a: "aboutPage.faq.a3" },
    { q: "aboutPage.faq.q4", a: "aboutPage.faq.a4" },
    { q: "aboutPage.faq.q5", a: "aboutPage.faq.a5" },
    { q: "aboutPage.faq.q6", a: "aboutPage.faq.a6" },
  ]

  const teamMembers = [
    { role: "aboutPage.team.roles.logistics", img: "/man-profile.jpg" },
    { role: "aboutPage.team.roles.programming", img: "/fondatrice.jpg" },
    { role: "aboutPage.team.roles.communication", img: "/jenny.jpg" },
  ]

  return (
    <main className="w-full bg-[#0A0A0A]">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-16 px-4 md:px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          {t("aboutPage.hero.title", language)}
        </h1>
        <p className="text-xl text-[#CCCCCC] max-w-3xl mx-auto">
          {t("aboutPage.hero.subtitle", language)}
        </p>
      </section>

      {/* WHAT IS */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 mb-16">

          <h2 className="text-4xl font-bold text-white mb-6">
            {t("aboutPage.whatIs.title", language)}
          </h2>

          <p className="text-lg text-[#CCCCCC] leading-relaxed mb-6">
            {t("aboutPage.whatIs.p1", language)}
          </p>

          <p className="text-lg text-[#CCCCCC] leading-relaxed mb-6">
            {t("aboutPage.whatIs.p2", language)}
          </p>

          {/* NEXT EDITION */}
          <div className="bg-white/5 border border-[#DC143C]/50 rounded-xl p-6 mb-6">
            <p className="text-xl text-white font-semibold mb-2">
              {t("aboutPage.whatIs.nextEditionTitle", language)}
            </p>
            <p className="text-[#DC143C] font-medium">
              {t("aboutPage.whatIs.nextEditionSubtitle", language)}
            </p>
          </div>

          {/* CLOTHING */}
          <div className="bg-[#DC143C]/20 border border-[#DC143C]/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              {t("aboutPage.whatIs.clothingTitle", language)}
            </h3>
            <p className="text-[#CCCCCC]">
              {t("aboutPage.whatIs.clothingText", language)}
            </p>
          </div>

        </div>
      </section>

      {/* VISION & VALUES */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          {t("aboutPage.visionValues.title", language)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* EXPERIENCE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#DC143C]/50 transition-all">
            <Film size={48} className="text-[#DC143C] mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              {t("aboutPage.visionValues.experienceTitle", language)}
            </h3>
            <p className="text-[#CCCCCC]">
              {t("aboutPage.visionValues.experienceText", language)}
            </p>
          </div>

          {/* CONVIVIALITY */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#DC143C]/50 transition-all">
            <Users size={48} className="text-[#DC143C] mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              {t("aboutPage.visionValues.convivialityTitle", language)}
            </h3>
            <p className="text-[#CCCCCC]">
              {t("aboutPage.visionValues.convivialityText", language)}
            </p>
          </div>

          {/* QUALITY */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#DC143C]/50 transition-all">
            <Trophy size={48} className="text-[#DC143C] mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              {t("aboutPage.visionValues.qualityTitle", language)}
            </h3>
            <p className="text-[#CCCCCC]">
              {t("aboutPage.visionValues.qualityText", language)}
            </p>
          </div>

          {/* INNOVATION */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#DC143C]/50 transition-all">
            <Zap size={48} className="text-[#DC143C] mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              {t("aboutPage.visionValues.innovationTitle", language)}
            </h3>
            <p className="text-[#CCCCCC]">
              {t("aboutPage.visionValues.innovationText", language)}
            </p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          {t("aboutPage.team.title", language)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="rounded-full w-32 h-32 mx-auto mb-6 overflow-hidden shadow-lg">
                <img src={member.img} alt={t(member.role, language)} className="w-full h-full object-cover" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {t(member.role, language)}
              </h3>

              <p className="text-[#CCCCCC]">
                {t("aboutPage.team.defaultMemberText", language)}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          {t("aboutPage.faq.title", language)}
        </h2>

        <div className="space-y-4">

          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#DC143C]/50 transition-all"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/10 transition-all"
              >
                <h3 className="text-lg font-bold text-white text-left">
                  {t(item.q, language)}
                </h3>

                <span
                  className={`text-[#DC143C] text-2xl transition-transform ${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {expandedFaq === index && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <p className="text-[#CCCCCC] leading-relaxed">
                    {t(item.a, language)}
                  </p>
                </div>
              )}
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto text-center mb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12">

          <h2 className="text-4xl font-bold text-white mb-4">
            {t("aboutPage.cta.title", language)}
          </h2>

          <p className="text-xl text-[#CCCCCC] mb-8">
            {t("aboutPage.cta.subtitle", language)}
          </p>

          <Link href="/reservation">
            <button className="bg-[#8B0000] hover:bg-[#DC143C] text-white px-12 py-4 rounded-lg font-bold transition-all hover:scale-105 shadow-lg shadow-red-950/50">
              {t("aboutPage.cta.button", language)}
            </button>
          </Link>

        </div>
      </section>

      <Footer />
    </main>
  )
}
