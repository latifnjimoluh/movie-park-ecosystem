"use client"

import { useState } from "react"
import { Instagram, Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"
import { t } from "@/lib/i18n"  // ton helper pour traduire
import { useTheme } from "@/lib/theme-context"// si tu utilises un provider

export default function Footer() {
  const [email, setEmail] = useState("")
  const { language } = useTheme() // fr | en

  const navLinks = [
    { label: t("footer.navigation.home", language), href: "/" },
    { label: t("footer.navigation.films", language), href: "/films" },
    { label: t("footer.navigation.reservation", language), href: "/reservation" },
    { label: t("footer.navigation.archives", language), href: "/archives" },
    { label: t("footer.navigation.about", language), href: "/a-propos" },
    { label: t("footer.navigation.contact", language), href: "/contact" },
  ]

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-16">

          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img src="/apple-icon.png" alt="Logo" className="w-full h-full object-cover" />
              </div>

              <span className="text-white font-bold text-xs md:text-sm lg:text-base">
                {t("footer.brand.title", language)}
              </span>
            </div>

            <p className="text-[#CCCCCC] text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              {t("footer.brand.tagline", language)}
            </p>

            {/* Socials */}
            <div className="flex gap-3 md:gap-4">
              <a
                href="https://instagram.com/movieinthe.park"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FACC15] transition-colors"
              >
                <Instagram size={18} />
              </a>

              <a
                href="https://www.facebook.com/movieinthepark237"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FACC15] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@movie_in_the_park237"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FACC15] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M41,12.07a9.68,9.68,0,0,1-5.66-1.81A10.11,10.11,0,0,1,32.18,5H26V31.08a6.48,6.48,0,1,1-4.57-6.18V18.07a12.07,12.07,0,1,0,8.65,11.51V17.51A15.22,15.22,0,0,0,38,20a15.36,15.36,0,0,0,3-.3V13.61A9.86,9.86,0,0,1,41,12.07Z"/>
                </svg>
              </a>

              <a
                href="https://chat.whatsapp.com/KXPxzuyO3SiC18g89JtKz9?mode=ac_t"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FACC15] transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs md:text-sm lg:text-lg mb-6">
              {t("footer.navigation.title", language)}
            </h4>

            <ul className="space-y-2 lg:space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#CCCCCC] hover:text-[#FACC15] transition-colors text-xs md:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs md:text-sm lg:text-lg mb-6">
              {t("footer.contact.title", language)}
            </h4>

            <ul className="space-y-2 lg:space-y-4 text-xs md:text-sm">

              <li className="flex items-center gap-3 text-[#CCCCCC] hover:text-[#FACC15]">
                <Phone size={14} className="text-[#FACC15]" />
                <a href="tel:+237697304450">{t("footer.contact.phone.number", language)}</a>
              </li>

              <li className="flex items-center gap-3 text-[#CCCCCC] hover:text-[#FACC15]">
                <Mail size={14} className="text-[#FACC15]" />
                <a href="mailto:matangabrooklyn@gmail.com">
                  {t("footer.contact.email.address", language)}
                </a>
              </li>

              <li className="flex items-center gap-3 text-[#CCCCCC] hover:text-[#FACC15]">
                <MessageCircle size={14} className="text-[#FACC15]" />
                <a href="https://wa.me/237697304450" target="_blank">
                  WhatsApp
                </a>
              </li>

              <li className="flex items-center gap-3 text-[#CCCCCC] hover:text-[#FACC15]">
                <MapPin size={14} className="text-[#FACC15]" />
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=3.876146,11.518691"
                  target="_blank"
                  className="hover:underline"
                >
                  {t("footer.contact.location.address", language)}
                </a>
              </li>

            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-xs md:text-sm lg:text-lg mb-6">
              {t("footer.newsletter.title", language)}
            </h4>

            <p className="text-[#CCCCCC] text-xs md:text-sm mb-4">
              {t("footer.newsletter.subtitle", language)}
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder={t("footer.newsletter.placeholder", language)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-[#999] focus:outline-none focus:border-[#FACC15]"
              />
              <a href="#">
              <button className="bg-[#CA8A04] hover:bg-[#FACC15] text-white px-4 py-2 rounded-lg text-xs md:text-sm">
                {t("footer.newsletter.button", language)}
              </button>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-[#999]">
          <p>{t("footer.copyright.text", language)}</p>

          <div className="flex gap-4">
            <Link href="/" className="hover:text-[#FACC15]">
              {t("footer.copyright.legal", language)}
            </Link>
            <Link href="/" className="hover:text-[#FACC15]">
              {t("footer.copyright.privacy", language)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
