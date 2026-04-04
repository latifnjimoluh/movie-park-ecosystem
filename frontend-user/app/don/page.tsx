"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"
import { API_ENDPOINTS } from "@/lib/api-config"
import { Heart, BookOpen, Utensils, Music } from "lucide-react"

const PRESET_AMOUNTS = [500, 1000, 2000, 5000]

export default function DonPage() {
  const { language } = useTheme()

  const [donorName, setDonorName]   = useState("")
  const [email, setEmail]           = useState("")
  const [amount, setAmount]         = useState<number | "">("")
  const [customAmount, setCustom]   = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [donated, setDonated]       = useState<{ id: string; amount: number } | null>(null)

  const finalAmount = amount !== "" ? amount : Number(customAmount)

  const handlePreset = (val: number) => {
    setAmount(val)
    setCustom("")
  }

  const handleCustom = (val: string) => {
    setAmount("")
    setCustom(val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!finalAmount || finalAmount <= 0) {
      setError(t("donPage.error", language))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(API_ENDPOINTS.DONATIONS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: donorName || undefined,
          email: email || undefined,
          amount: finalAmount,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur serveur")
      setDonated({ id: data.donation.id, amount: finalAmount })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("donPage.error", language))
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappUrl = `https://wa.me/237697304450?text=${encodeURIComponent(
    `DON ORPHELINS — Référence: ${donated?.id ?? ""} — Montant: ${donated?.amount ?? ""} XAF`
  )}`

  const impactItems = [
    { Icon: BookOpen, text: t("donPage.impact.item1", language) },
    { Icon: Utensils, text: t("donPage.impact.item2", language) },
    { Icon: Music,    text: t("donPage.impact.item3", language) },
  ]

  return (
    <main className="page-root w-full">
      <Header />

      {/* Hero */}
      <section className="page-hero pt-32 pb-12 px-4 md:px-6 max-w-5xl mx-auto text-center">
        <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
          {t("donPage.hero.badge", language)}
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          {t("donPage.hero.title", language)}
        </h1>
        <p className="films-desc text-xl max-w-3xl mx-auto">
          {t("donPage.hero.subtitle", language)}
        </p>
      </section>

      {/* Impact rapide */}
      <section className="py-10 px-4 md:px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          {t("donPage.impact.title", language)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {impactItems.map(({ Icon, text }, i) => (
            <div key={i} className="whycome-card rounded-2xl p-6 flex items-center gap-4 group">
              <div className="whycome-icon-wrap w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={24} className="text-[#A78BFA]" />
              </div>
              <p className="whycome-desc text-sm leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire + Instructions */}
      <section className="py-12 px-4 md:px-6 max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Formulaire */}
          <div className="about-card rounded-2xl p-8">
            {donated ? (
              /* Succès */
              <div className="text-center py-6">
                <div className="text-6xl mb-4">🤍</div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  {t("donPage.success.title", language)}
                </h2>
                <p className="films-desc text-base mb-8 leading-relaxed">
                  {t("donPage.success.message", language)}
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-cta-btn px-8 py-3 rounded-xl font-bold text-center hover:scale-105 transition-transform inline-block"
                  >
                    {t("donPage.success.whatsappButton", language)}
                  </a>
                  <Link href="/">
                    <button type="button" className="hero-btn-outline w-full px-8 py-3 rounded-xl font-medium">
                      {t("donPage.success.backButton", language)}
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              /* Formulaire */
              <>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {t("donPage.form.title", language)}
                </h2>
                <p className="films-desc text-sm mb-6">
                  {t("donPage.form.subtitle", language)}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      {t("donPage.form.nameLabel", language)}
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={t("donPage.form.namePlaceholder", language)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#A78BFA]/60"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      {t("donPage.form.emailLabel", language)}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("donPage.form.emailPlaceholder", language)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#A78BFA]/60"
                    />
                  </div>

                  {/* Montant */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {t("donPage.form.amountLabel", language)}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {PRESET_AMOUNTS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePreset(p)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            amount === p
                              ? "bg-[#A78BFA] text-white border-[#A78BFA]"
                              : "bg-white/5 border-white/10 text-white/70 hover:border-[#A78BFA]/50"
                          }`}
                        >
                          {p.toLocaleString("fr-FR")} XAF
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={100}
                      value={customAmount}
                      onChange={(e) => handleCustom(e.target.value)}
                      placeholder={t("donPage.form.amountPlaceholder", language)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#A78BFA]/60"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || (!finalAmount || finalAmount <= 0)}
                    className="header-cta-btn w-full py-4 rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <Heart size={18} />
                    {submitting
                      ? t("donPage.form.submitting", language)
                      : t("donPage.form.submitButton", language)}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Instructions de paiement */}
          <div className="space-y-5">
            <div className="about-edition-card rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                {t("donPage.payment.title", language)}
              </h3>

              <ol className="space-y-5">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A78BFA]/20 border border-[#A78BFA]/40 flex items-center justify-center text-[#A78BFA] font-bold text-sm">
                    1
                  </span>
                  <p className="films-desc text-sm leading-relaxed pt-1">
                    {t("donPage.payment.step1", language)}
                  </p>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A78BFA]/20 border border-[#A78BFA]/40 flex items-center justify-center text-[#A78BFA] font-bold text-sm">
                    2
                  </span>
                  <div className="pt-1">
                    <p className="films-desc text-sm mb-2">
                      {t("donPage.payment.step2", language)}
                    </p>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-white font-semibold text-sm">
                        {t("donPage.payment.operator", language)}
                      </p>
                      <p className="text-[#A78BFA] font-bold text-lg mt-1">
                        {t("donPage.payment.number", language)}
                      </p>
                    </div>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A78BFA]/20 border border-[#A78BFA]/40 flex items-center justify-center text-[#A78BFA] font-bold text-sm">
                    3
                  </span>
                  <div className="pt-1">
                    <p className="films-desc text-sm leading-relaxed">
                      {t("donPage.payment.step3", language)}
                    </p>
                    <p className="text-[#A78BFA]/70 text-xs mt-1 italic">
                      {t("donPage.payment.step3Sub", language)}
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="about-clothing-card rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">🙏</p>
              <p className="text-white font-semibold text-lg mb-1">
                Merci pour votre générosité
              </p>
              <p className="films-desc text-sm">
                Ensemble, nous pouvons faire une vraie différence dans la vie des enfants orphelins de Yaoundé.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
