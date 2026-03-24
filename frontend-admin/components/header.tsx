"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { t } from "@/lib/i18n"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { darkMode, toggleDarkMode, language, setLanguage } = useTheme()

  const navLinks = [
    { key: "common.home",        href: "/" },
    { key: "common.films",       href: "/films" },
    { key: "common.reservation", href: "/reservation" },
    { key: "common.archives",    href: "/archives" },
    { key: "common.about",       href: "/a-propos" },
    { key: "common.contact",     href: "/contact" },
  ]

  return (
    <header className="header-root fixed top-0 w-full z-[1000] backdrop-blur-md border-b h-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
          <div className="flex items-center gap-2.5">
            <div className="header-logo-ring w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
              <img src="/apple-icon.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-bold text-xs md:text-sm leading-tight">
                Movie in the Park
              </span>
              <span className="header-subtitle">✝ Édition Pâques 2026</span>
            </div>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`header-nav-link group${active ? " active" : ""}`}
              >
                {t(link.key, language)}
                {active
                  ? <span className="header-nav-underline-active" />
                  : <span className="header-nav-underline-hover" />
                }
              </Link>
            )
          })}
        </nav>

        {/* Contrôles Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <button type="button" onClick={toggleDarkMode} className="header-icon-btn">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="header-lang-wrapper">
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`header-lang-btn${language === "fr" ? " active" : ""}`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`header-lang-btn${language === "en" ? " active" : ""}`}
            >
              EN
            </button>
          </div>

          <Link href="/reservation">
            <button type="button" className="header-cta-btn">
              {t("common.reservation", language)}
            </button>
          </Link>
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden header-icon-btn"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="mobile-menu-root lg:hidden">
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`mobile-nav-link${active ? " active" : ""}`}
                >
                  {t(link.key, language)}
                </Link>
              )
            })}

            <div className="mobile-controls-divider space-y-2">
              <button type="button" onClick={toggleDarkMode} className="mobile-theme-btn">
                <span>{darkMode ? "Mode clair" : "Mode sombre"}</span>
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <div className="mobile-lang-wrapper">
                <button
                  type="button"
                  onClick={() => { setLanguage("fr"); setIsOpen(false) }}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-all header-lang-btn${language === "fr" ? " active" : ""}`}
                >
                  Français
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage("en"); setIsOpen(false) }}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-all header-lang-btn${language === "en" ? " active" : ""}`}
                >
                  English
                </button>
              </div>

              <Link href="/reservation" onClick={() => setIsOpen(false)}>
                <button type="button" className="mobile-cta-btn">
                  {t("common.reservation", language)}
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
