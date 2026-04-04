"use client"

import type React from "react"

import { useTrackVisit } from "@/hooks/use-track-visit"

export function TrackingWrapper({ children }: { children: React.ReactNode }) {
  useTrackVisit()
  return <>{children}</>
}
