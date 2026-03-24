"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { ThemeToggle } from "@/components/admin/theme-toggle"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const init = () => setSidebarOpen(window.innerWidth >= 1024)
    init()
    window.addEventListener("resize", init)
    return () => window.removeEventListener("resize", init)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 md:px-6 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-all active:scale-95 group border border-transparent hover:border-border shadow-sm hover:shadow-md bg-background"
              aria-label={sidebarOpen ? "Réduire la barre latérale" : "Ouvrir la barre latérale"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              ) : (
                <PanelLeftOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </button>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-tight">Admin Console</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Movie in the Park</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  )
}
