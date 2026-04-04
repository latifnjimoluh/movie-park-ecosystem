"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-[#854D0E] hover:bg-[#b00020] shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center group"
        aria-label="Retour en haut"
      >
        <ArrowUp className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>
    )
  )
}
