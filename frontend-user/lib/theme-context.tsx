"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
  language: "fr" | "en"
  setLanguage: (lang: "fr" | "en") => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguageLang] = useState<"fr" | "en">("fr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const savedDarkMode = localStorage.getItem("darkMode")
    const savedLanguage =
      (localStorage.getItem("language") as "fr" | "en" | null) ?? "fr"

    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode))
    }

    setLanguageLang(savedLanguage)
  }, [])

  const toggleDarkMode = () => {
    const value = !darkMode
    setDarkMode(value)
    localStorage.setItem("darkMode", JSON.stringify(value))
  }

  const setLanguage = (lang: "fr" | "en") => {
    setLanguageLang(lang)
    localStorage.setItem("language", lang)
  }

  // Empêche l’erreur useTheme pendant hydratation
  // Toujours retourner le provider afin que `useTheme` trouve un contexte
  // pendant le rendu client initial. On évite d'accéder à `localStorage`
  // tant que `mounted` n'est pas vrai (la lecture a lieu dans useEffect).
  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        language,
        setLanguage,
      }}
    >
      <div className={mounted && darkMode ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within AppThemeProvider")
  }
  return context
}
