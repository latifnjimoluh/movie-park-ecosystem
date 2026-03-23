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
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      })

      setSubmitted(true)
      setToast({
        type: "success",
        message: t("contactPage.form.sentText", language),
      })

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: t("contactPage.form.fields.subject.options.reservationQuestion", language),
          message: "",
        })
        setSubmitted(false)
        setToast(null)
      }, 3000)
    } catch (error) {
      setToast({
        type: "error",
        message: "Une erreur est survenue. Veuillez réessayer.",
      })
      console.error("[v0] Contact form error:", error)
    } finally {
      setLoading(false)
    }
  }

  const whatsappLink = "https://wa.me/237697304450?text=Bonjour%20Movie%20in%20the%20Park%2C%20j%27ai%20une%20question."
  const mailLink = "mailto:matangabrooklyn@gmail.com?subject=Contact%20-%20Movie%20in%20the%20Park"

  return (
    <main className="w-full bg-[#0A0A0A]">
      <Header />

      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white font-semibold transition-all ${
            toast.type === "success" ? "bg-[#1A4D2E] border border-[#4CAF50]" : "bg-[#4D1A1A] border border-[#FF6B6B]"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* HERO */}
      <section className="pt-20 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6">
          {t("contactPage.hero.title", language)}
        </h1>
        <p className="text-lg md:text-xl text-[#CCCCCC] max-w-3xl mx-auto px-2">
          {t("contactPage.hero.subtitle", language)}
        </p>
      </section>

      {/* CONTACT METHODS */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12">
          {t("contactPage.directContacts.title", language)}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-6 md:p-8 text-center hover:border-[#25D366]/50 hover:bg-white/10 transition-all group"
          >
            <MessageCircle
              size={40}
              className="text-[#25D366] mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform"
            />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
              {t("contactPage.directContacts.whatsapp.title", language)}
            </h3>
            <p className="text-xs md:text-sm text-[#CCCCCC] mb-2 md:mb-4">
              {t("contactPage.directContacts.whatsapp.subtitle", language)}
            </p>
            <p className="text-white font-semibold text-sm md:text-base">
              {t("contactPage.directContacts.whatsapp.number", language)}
            </p>
          </a>

          {/* Phone */}
          <a
            href="tel:+237697304450"
            className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-6 md:p-8 text-center hover:border-[#DC143C]/50 hover:bg-white/10 transition-all group"
          >
            <Phone
              size={40}
              className="text-[#DC143C] mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform"
            />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
              {t("contactPage.directContacts.phone.title", language)}
            </h3>
            <p className="text-xs md:text-sm text-[#CCCCCC] mb-2 md:mb-4">
              {t("contactPage.directContacts.phone.subtitle", language)}
            </p>
            <p className="text-white font-semibold text-sm md:text-base">
              {t("contactPage.directContacts.phone.number", language)}
            </p>
          </a>

          {/* Email */}
          <a
            href={mailLink}
            className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-6 md:p-8 text-center hover:border-[#FF6B6B]/50 hover:bg-white/10 transition-all group"
          >
            <Mail
              size={40}
              className="text-[#FF6B6B] mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform"
            />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
              {t("contactPage.directContacts.email.title", language)}
            </h3>
            <p className="text-xs md:text-sm text-[#CCCCCC] mb-2 md:mb-4">
              {t("contactPage.directContacts.email.subtitle", language)}
            </p>
            <p className="text-white font-semibold text-xs md:text-sm break-all">
              {t("contactPage.directContacts.email.address", language)}
            </p>
          </a>

          {/* Location */}
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=3.876146,11.518691"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-6 md:p-8 text-center hover:bg-white/10 hover:border-[#4169E1]/50 transition-all cursor-pointer"
          >
            <MapPin
              size={40}
              className="text-[#4169E1] mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform"
            />

            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
              {t("contactPage.directContacts.location.title", language)}
            </h3>

            <p className="text-xs md:text-sm text-[#CCCCCC] mb-2 md:mb-4">
              {t("contactPage.directContacts.location.subtitle", language)}
            </p>

            <p className="text-white font-semibold text-sm md:text-base underline">
              {t("contactPage.directContacts.location.place", language)}
            </p>
          </a>
        </div>

        {/* Schedule */}
        <div className="mt-8 md:mt-12 bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-6 md:p-8 text-center">
          <Clock size={32} className="text-[#DC143C] mx-auto mb-3 md:mb-4" />

          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
            {t("contactPage.schedule.title", language)}
          </h3>

          <p className="text-sm md:text-base text-[#CCCCCC]">{t("contactPage.schedule.mondaySaturday", language)}</p>
          <p className="text-sm md:text-base text-[#CCCCCC]">{t("contactPage.schedule.sunday", language)}</p>
          <p className="text-xs md:text-sm text-[#999999] mt-3 md:mt-4">
            {t("contactPage.schedule.responseTime", language)}
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-2xl mx-auto mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12">
          {t("contactPage.form.title", language)}
        </h2>

        {submitted ? (
          <div className="bg-[#1A4D2E] border border-[#4CAF50] rounded-lg md:rounded-xl p-6 md:p-8 text-center">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">✓</div>
            <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
              {t("contactPage.form.sentTitle", language)}
            </h3>
            <p className="text-sm md:text-base text-[#CCCCCC]">{t("contactPage.form.sentText", language)}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Name */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.name.label", language)}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("contactPage.form.fields.name.placeholder", language)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white disabled:opacity-50"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.email.label", language)}
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("contactPage.form.fields.email.placeholder", language)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white disabled:opacity-50"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.phone.label", language)}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t("contactPage.form.fields.phone.placeholder", language)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white disabled:opacity-50"
                disabled={loading}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.subject.label", language)}
              </label>

              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white
                          [&>option]:bg-[#1a1a1a] [&>option]:text-white disabled:opacity-50"
                disabled={loading}
              >
                <option value={t("contactPage.form.fields.subject.options.reservationQuestion", language)}>
                  {t("contactPage.form.fields.subject.options.reservationQuestion", language)}
                </option>

                <option value={t("contactPage.form.fields.subject.options.packQuestion", language)}>
                  {t("contactPage.form.fields.subject.options.packQuestion", language)}
                </option>

                <option value={t("contactPage.form.fields.subject.options.partnership", language)}>
                  {t("contactPage.form.fields.subject.options.partnership", language)}
                </option>

                <option value={t("contactPage.form.fields.subject.options.feedback", language)}>
                  {t("contactPage.form.fields.subject.options.feedback", language)}
                </option>

                <option value={t("contactPage.form.fields.subject.options.other", language)}>
                  {t("contactPage.form.fields.subject.options.other", language)}
                </option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm md:text-base">
                {t("contactPage.form.fields.message.label", language)}
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                placeholder={t("contactPage.form.fields.message.placeholder", language)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white resize-none disabled:opacity-50"
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B0000] hover:bg-[#DC143C] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 md:px-6 py-3 md:py-4 rounded-lg font-bold transition-all hover:scale-105 shadow-lg shadow-red-950/50 text-sm md:text-base"
            >
              {loading ? "Envoi en cours..." : t("contactPage.form.submit.button", language)}
            </button>
          </form>
        )}
      </section>

      {/* SOCIAL LINKS */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto text-center mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
          {t("contactPage.socials.title", language)}
        </h2>

        <div className="flex justify-center gap-6 md:gap-8">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/movieinthepark237"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-[#1877F2] border border-white/10 hover:border-[#1877F2] rounded-full p-4 md:p-6 transition-all group"
          >
            <Facebook size={24} className="text-white group-hover:scale-110 transition-transform md:w-8 md:h-8" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/movieinthe.park"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-gradient-to-br hover:from-[#FD5949] hover:to-[#D6249F] border border-white/10 hover:border-[#D6249F] rounded-full p-4 md:p-6 transition-all group"
          >
            <Instagram size={24} className="text-white group-hover:scale-110 transition-transform md:w-8 md:h-8" />
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@movie_in_the_park237"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-[#000000] border border-white/10 hover:border-[#000000] rounded-full p-4 md:p-6 transition-all group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              width="24"
              height="24"
              className="text-white fill-white group-hover:scale-110 transition-transform md:w-8 md:h-8"
            >
              <path d="M232 72.7a72 72 0 0 1-40-12.2V160a72 72 0 1 1-72-72 12 12 0 0 1 0 24 48 48 0 1 0 48 48V12a12 12 0 0 1 24 0 48 48 0 0 0 48 48 12 12 0 0 1 0 24Z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-[#25D366] border border-white/10 hover:border-[#25D366] rounded-full p-4 md:p-6 transition-all group"
          >
            <MessageCircle size={24} className="text-white group-hover:scale-110 transition-transform md:w-8 md:h-8" />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
