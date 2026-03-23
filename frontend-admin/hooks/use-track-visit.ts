"use client"

import { useEffect } from "react"
import { API_URL } from "@/lib/api-config"

export const useTrackVisit = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch(`${API_URL}/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Visit tracked successfully:", data)
        }
      } catch (error) {
        console.error("[v0] Error tracking visit:", error)
      }
    }

    trackVisit()
  }, [])
}
