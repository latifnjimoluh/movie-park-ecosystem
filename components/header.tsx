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
    { key: "common.home", href: "/" },
    { key: "common.films", href: "/films" },
    { key: "common.reservation", href: "/reservation" },
    { key: "common.archives", href: "/archives" },
    { key: "common.about", href: "/a-propos" },
    { key: "common.contact", href: "/contact" },
  ]

  return (
    <header className="fixed top-0 w-full z-[1000] bg-black/95 backdrop-blur-sm border-b border-white/10 h-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
              <img src="/apple-icon.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="hidden sm:block text-white font-bold text-xs md:text-sm">
              Movie in the Park
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  active ? "text-[#DC143C] font-bold" : "text-[#F8F8F8] hover:text-[#DC143C]"
                }`}
              >
                {t(link.key, language)}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white hover:text-[#DC143C]"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Lang switch */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-3 py-1 rounded text-xs font-medium ${
                language === "fr" ? "bg-[#A00000] text-white" : "text-[#CCCCCC] hover:text-white"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded text-xs font-medium ${
                language === "en" ? "bg-[#A00000] text-white" : "text-[#CCCCCC] hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* CTA */}
          <Link href="/reservation">
            <button className="bg-[#8B0000] hover:bg-[#DC143C] text-white px-6 py-2 rounded-lg font-medium transition hover:scale-105 hover:shadow-lg hover:shadow-red-950/50 text-sm">
              {t("common.reservation", language)}
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-[#DC143C] transition"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/98 border-b border-white/10">
          <nav className="flex flex-col gap-3 p-4">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 text-sm ${
                    active ? "text-[#DC143C] font-bold" : "text-white hover:text-[#DC143C]"
                  }`}
                >
                  {t(link.key, language)}
                </Link>
              )
            })}

            {/* Mobile theme + language */}
            <div className="border-t border-white/10 pt-3 mt-3 space-y-3">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg text-white text-sm"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                <span>{darkMode ? "Mode clair" : "Mode sombre"}</span>
              </button>

              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => {
                    setLanguage("fr")
                    setIsOpen(false)
                  }}
                  className={`flex-1 px-3 py-2 rounded text-xs font-medium ${
                    language === "fr" ? "bg-[#A00000] text-white" : "text-[#CCCCCC] hover:text-white"
                  }`}
                >
                  Français
                </button>

                <button
                  onClick={() => {
                    setLanguage("en")
                    setIsOpen(false)
                  }}
                  className={`flex-1 px-3 py-2 rounded text-xs font-medium ${
                    language === "en" ? "bg-[#A00000] text-white" : "text-[#CCCCCC] hover:text-white"
                  }`}
                >
                  English
                </button>
              </div>

              {/* CTA mobile */}
              <Link href="/reservation" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-[#8B0000] hover:bg-[#DC143C] text-white py-2 rounded-lg font-medium mt-2 text-sm">
                  Réserver
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
