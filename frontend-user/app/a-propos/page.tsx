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
    { role: "aboutPage.team.roles.logistics",    img: "/man-profile.jpg" },
    { role: "aboutPage.team.roles.programming",  img: "/fondatrice.jpg" },
    { role: "aboutPage.team.roles.communication", img: "/man-profile.jpg" },
  ]

  const values = [
    { Icon: Film,   titleKey: "aboutPage.visionValues.experienceTitle",   textKey: "aboutPage.visionValues.experienceText"   },
    { Icon: Users,  titleKey: "aboutPage.visionValues.convivialityTitle",  textKey: "aboutPage.visionValues.convivialityText"  },
    { Icon: Trophy, titleKey: "aboutPage.visionValues.qualityTitle",       textKey: "aboutPage.visionValues.qualityText"       },
    { Icon: Zap,    titleKey: "aboutPage.visionValues.innovationTitle",    textKey: "aboutPage.visionValues.innovationText"    },
  ]

  return (
    <main className="page-root w-full">
      <Header />

      {/* Hero */}
      <section className="page-hero pt-32 pb-16 px-4 md:px-6 max-w-6xl mx-auto text-center">
        <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
          🕊️ À propos
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          {t("aboutPage.hero.title", language)}
        </h1>
        <p className="films-desc text-xl max-w-3xl mx-auto">
          {t("aboutPage.hero.subtitle", language)}
        </p>
      </section>

      {/* Qu'est-ce que c'est */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="about-card rounded-2xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t("aboutPage.whatIs.title", language)}
          </h2>
          <p className="films-desc text-lg leading-relaxed mb-6">
            {t("aboutPage.whatIs.p1", language)}
          </p>
          <p className="films-desc text-lg leading-relaxed mb-6">
            {t("aboutPage.whatIs.p2", language)}
          </p>

          {/* Prochaine édition */}
          <div className="about-edition-card rounded-xl p-6 mb-6">
            <p className="text-xl text-white font-semibold mb-2">
              {t("aboutPage.whatIs.nextEditionTitle", language)}
            </p>
            <p className="text-[#A78BFA] font-medium">
              {t("aboutPage.whatIs.nextEditionSubtitle", language)}
            </p>
          </div>

          {/* Code vestimentaire */}
          <div className="about-clothing-card rounded-xl p-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              {t("aboutPage.whatIs.clothingTitle", language)}
            </h3>
            <p className="films-desc">
              {t("aboutPage.whatIs.clothingText", language)}
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Valeurs */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          {t("aboutPage.visionValues.title", language)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {values.map(({ Icon, titleKey, textKey }) => (
            <div key={titleKey} className="whycome-card rounded-2xl p-8 group transition-all">
              <Icon size={48} className="text-[#A78BFA] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                {t(titleKey, language)}
              </h3>
              <p className="films-desc">{t(textKey, language)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          {t("aboutPage.team.title", language)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="about-team-avatar rounded-full w-32 h-32 mx-auto mb-6 overflow-hidden">
                <img src={member.img} alt={t(member.role, language)} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t(member.role, language)}</h3>
              <p className="films-desc">{t("aboutPage.team.defaultMemberText", language)}</p>
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
            <div key={index} className="about-faq-item rounded-xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-6 flex items-center justify-between about-faq-btn transition-all"
              >
                <h3 className="text-lg font-bold text-white text-left">
                  {t(item.q, language)}
                </h3>
                <span className={`text-[#A78BFA] text-2xl transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-6 about-faq-answer">
                  <p className="films-desc leading-relaxed">{t(item.a, language)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto text-center mb-16">
        <div className="about-cta-card rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t("aboutPage.cta.title", language)}
          </h2>
          <p className="films-desc text-xl mb-8">
            {t("aboutPage.cta.subtitle", language)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation">
              <button type="button" className="header-cta-btn px-12 py-4 text-base rounded-xl font-bold hover:scale-105 transition-transform">
                {t("aboutPage.cta.button", language)}
              </button>
            </Link>
            <Link href="/don">
              <button type="button" className="hero-btn-don px-12 py-4 text-base rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                <span>🤍</span> {t("aboutPage.cta.donButton", language)}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
