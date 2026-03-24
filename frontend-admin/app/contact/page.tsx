"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Mail, Phone, MessageCircle, MapPin, Clock, Facebook, Instagram } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import { submitContactForm } from "@/lib/contact-service"

export default function ContactPage() {
  const { language } = useTheme()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Question sur la réservation",
    message: "",
  })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast]         = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitContactForm({ name: formData.name, email: formData.email, subject: formData.subject, message: formData.message })
      setSubmitted(true)
      setToast({ type: "success", message: t("contactPage.form.sentText", language) })
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", subject: t("contactPage.form.fields.subject.options.reservationQuestion", language), message: "" })
        setSubmitted(false)
        setToast(null)
      }, 3000)
    } catch (error) {
      setToast({ type: "error", message: "Une erreur est survenue. Veuillez réessayer." })
      console.error("[Contact] form error:", error)
    } finally {
      setLoading(false)
    }
  }

  const whatsappLink = "https://wa.me/237697304450?text=Bonjour%20Movie%20in%20the%20Park%2C%20j%27ai%20une%20question."
  const mailLink     = "mailto:matangabrooklyn@gmail.com?subject=Contact%20-%20Movie%20in%20the%20Park"

  return (
    <main className="page-root w-full">
      <Header />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white font-semibold transition-all ${
          toast.type === "success" ? "contact-toast-success" : "contact-toast-error"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Hero */}
      <section className="page-hero pt-20 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 max-w-6xl mx-auto text-center">
        <span className="films-badge inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
          ✉️ Contact
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6">
          {t("contactPage.hero.title", language)}
        </h1>
        <p className="films-desc text-lg md:text-xl max-w-3xl mx-auto px-2">
          {t("contactPage.hero.subtitle", language)}
        </p>
      </section>

      {/* Moyens de contact */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12">
          {t("contactPage.directContacts.title", language)}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">

          {/* WhatsApp */}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-card contact-card-whatsapp rounded-xl p-6 md:p-8 text-center transition-all group">
            <MessageCircle size={40} className="contact-icon-whatsapp mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t("contactPage.directContacts.whatsapp.title", language)}</h3>
            <p className="films-desc text-xs md:text-sm mb-2 md:mb-4">{t("contactPage.directContacts.whatsapp.subtitle", language)}</p>
            <p className="text-white font-semibold text-sm md:text-base">{t("contactPage.directContacts.whatsapp.number", language)}</p>
          </a>

          {/* Téléphone */}
          <a href="tel:+237697304450" className="contact-card contact-card-phone rounded-xl p-6 md:p-8 text-center transition-all group">
            <Phone size={40} className="contact-icon-phone mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t("contactPage.directContacts.phone.title", language)}</h3>
            <p className="films-desc text-xs md:text-sm mb-2 md:mb-4">{t("contactPage.directContacts.phone.subtitle", language)}</p>
            <p className="text-white font-semibold text-sm md:text-base">{t("contactPage.directContacts.phone.number", language)}</p>
          </a>

          {/* Email */}
          <a href={mailLink} className="contact-card contact-card-email rounded-xl p-6 md:p-8 text-center transition-all group">
            <Mail size={40} className="contact-icon-email mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t("contactPage.directContacts.email.title", language)}</h3>
            <p className="films-desc text-xs md:text-sm mb-2 md:mb-4">{t("contactPage.directContacts.email.subtitle", language)}</p>
            <p className="text-white font-semibold text-xs md:text-sm break-all">{t("contactPage.directContacts.email.address", language)}</p>
          </a>

          {/* Localisation */}
          <a href="https://www.google.com/maps/dir/?api=1&destination=3.876146,11.518691" target="_blank" rel="noopener noreferrer"
            className="contact-card contact-card-location block rounded-xl p-6 md:p-8 text-center transition-all cursor-pointer group">
            <MapPin size={40} className="contact-icon-location mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{t("contactPage.directContacts.location.title", language)}</h3>
            <p className="films-desc text-xs md:text-sm mb-2 md:mb-4">{t("contactPage.directContacts.location.subtitle", language)}</p>
            <p className="text-white font-semibold text-sm md:text-base underline">{t("contactPage.directContacts.location.place", language)}</p>
          </a>
        </div>

        {/* Horaires */}
        <div className="contact-schedule mt-8 md:mt-12 rounded-xl p-6 md:p-8 text-center">
          <Clock size={32} className="text-[#A78BFA] mx-auto mb-3 md:mb-4" />
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{t("contactPage.schedule.title", language)}</h3>
          <p className="films-desc text-sm md:text-base">{t("contactPage.schedule.mondaySaturday", language)}</p>
          <p className="films-desc text-sm md:text-base">{t("contactPage.schedule.sunday", language)}</p>
          <p className="contact-note text-xs md:text-sm mt-3 md:mt-4">{t("contactPage.schedule.responseTime", language)}</p>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-2xl mx-auto mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12">
          {t("contactPage.form.title", language)}
        </h2>

        {submitted ? (
          <div className="contact-success rounded-xl p-6 md:p-8 text-center">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">✓</div>
            <h3 className="text-lg md:text-2xl font-bold text-white mb-2">{t("contactPage.form.sentTitle", language)}</h3>
            <p className="films-desc text-sm md:text-base">{t("contactPage.form.sentText", language)}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="contact-label block font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.name.label", language)}
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                placeholder={t("contactPage.form.fields.name.placeholder", language)}
                className="contact-input w-full rounded-lg px-3 md:px-4 py-2 md:py-3 disabled:opacity-50"
                disabled={loading} />
            </div>

            <div>
              <label className="contact-label block font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.email.label", language)}
              </label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange}
                placeholder={t("contactPage.form.fields.email.placeholder", language)}
                className="contact-input w-full rounded-lg px-3 md:px-4 py-2 md:py-3 disabled:opacity-50"
                disabled={loading} />
            </div>

            <div>
              <label className="contact-label block font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.phone.label", language)}
              </label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                placeholder={t("contactPage.form.fields.phone.placeholder", language)}
                className="contact-input w-full rounded-lg px-3 md:px-4 py-2 md:py-3 disabled:opacity-50"
                disabled={loading} />
            </div>

            <div>
              <label className="contact-label block font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.subject.label", language)}
              </label>
              <select name="subject" value={formData.subject} onChange={handleInputChange}
                aria-label={t("contactPage.form.fields.subject.label", language)}
                title={t("contactPage.form.fields.subject.label", language)}
                className="contact-input contact-select w-full rounded-lg px-3 md:px-4 py-2 md:py-3 disabled:opacity-50"
                disabled={loading}>
                <option value={t("contactPage.form.fields.subject.options.reservationQuestion", language)}>{t("contactPage.form.fields.subject.options.reservationQuestion", language)}</option>
                <option value={t("contactPage.form.fields.subject.options.packQuestion", language)}>{t("contactPage.form.fields.subject.options.packQuestion", language)}</option>
                <option value={t("contactPage.form.fields.subject.options.partnership", language)}>{t("contactPage.form.fields.subject.options.partnership", language)}</option>
                <option value={t("contactPage.form.fields.subject.options.feedback", language)}>{t("contactPage.form.fields.subject.options.feedback", language)}</option>
                <option value={t("contactPage.form.fields.subject.options.other", language)}>{t("contactPage.form.fields.subject.options.other", language)}</option>
              </select>
            </div>

            <div>
              <label className="contact-label block font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.message.label", language)}
              </label>
              <textarea name="message" required value={formData.message} onChange={handleInputChange}
                rows={6} placeholder={t("contactPage.form.fields.message.placeholder", language)}
                className="contact-input w-full rounded-lg px-3 md:px-4 py-2 md:py-3 resize-none disabled:opacity-50"
                disabled={loading} />
            </div>

            <button type="submit" disabled={loading}
              className="contact-submit-btn w-full px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base">
              {loading ? "Envoi en cours..." : t("contactPage.form.submit.button", language)}
            </button>
          </form>
        )}
      </section>

      {/* Réseaux sociaux */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto text-center mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
          {t("contactPage.socials.title", language)}
        </h2>
        <div className="flex justify-center gap-6 md:gap-8">
          <a href="https://www.facebook.com/movieinthepark237" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            className="contact-social-btn rounded-full p-4 md:p-6 group hover:bg-[#1877F2] transition-all">
            <Facebook size={24} className="text-white group-hover:scale-110 transition-transform md:w-8 md:h-8" />
          </a>
          <a href="https://instagram.com/movieinthe.park" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="contact-social-btn rounded-full p-4 md:p-6 group transition-all">
            <Instagram size={24} className="text-white group-hover:scale-110 transition-transform md:w-8 md:h-8" />
          </a>
          <a href="https://www.tiktok.com/@movie_in_the_park237" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
            className="contact-social-btn rounded-full p-4 md:p-6 group transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"
              className="text-white fill-white group-hover:scale-110 transition-transform md:w-8 md:h-8" aria-hidden="true">
              <path d="M232 72.7a72 72 0 0 1-40-12.2V160a72 72 0 1 1-72-72 12 12 0 0 1 0 24 48 48 0 1 0 48 48V12a12 12 0 0 1 24 0 48 48 0 0 0 48 48 12 12 0 0 1 0 24Z" />
            </svg>
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
            className="contact-social-btn rounded-full p-4 md:p-6 group hover:bg-[#25D366] transition-all">
            <MessageCircle size={24} className="text-white group-hover:scale-110 transition-transform md:w-8 md:h-8" />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
