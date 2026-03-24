"use client"

  import Link from "next/link"
  import { usePathname } from "next/navigation"
  import {
    LayoutDashboard,
    BookOpen,
    CreditCard,
    Ticket,
    Settings,
    Users,
    QrCode,
    Package,
    ShieldCheck,
    X,
    Film,
    Clock,
    MessageSquareQuote,
    SlidersHorizontal,
    LogOut,
  } from "lucide-react"
  import { api } from "@/lib/api"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { useState } from "react"

  interface SidebarProps {
    isOpen?: boolean
    onToggle?: () => void
  }

  export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
    const pathname = usePathname()
    const isActive = (href: string) => pathname === href

    const navItems = [
      { href: "/admin/dashboard",     label: "Tableau de bord",    icon: LayoutDashboard },
      { href: "/admin/reservation/create", label: "Créer réservation", icon: BookOpen },
      { href: "/admin/reservations",  label: "Réservations",       icon: BookOpen },
      { href: "/admin/payments",      label: "Paiements",          icon: CreditCard },
      { href: "/admin/tickets",       label: "Tickets",            icon: Ticket },
      { href: "/admin/scan",          label: "Contrôle d'entrée",  icon: QrCode },
      { href: "/admin/packs",         label: "Packs",              icon: Package },
      { href: "/admin/users",         label: "Utilisateurs",       icon: Users },
      { href: "/admin/audit",         label: "Journal d'audit",    icon: ShieldCheck },
      // ── Contenu dynamique ──
      { href: "/admin/films",         label: "Films",              icon: Film },
      { href: "/admin/schedule",      label: "Programme soirée",   icon: Clock },
      { href: "/admin/testimonials",  label: "Témoignages",        icon: MessageSquareQuote },
      { href: "/admin/event-config",  label: "Config événement",   icon: SlidersHorizontal },
      { href: "/admin/settings",      label: "Paramètres",         icon: Settings },
    ]

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    const handleLogout = () => {
      api.auth.logout()
    }

    return (
      <>
        {/* Modal de déconnexion */}
        <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
          <DialogContent className="bg-card border-border sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <LogOut className="w-5 h-5" />
                Déconnexion
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir vous déconnecter de votre session administrateur ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Se déconnecter
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Overlay mobile avec animation de fondu */}
        <div
          className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 lg:hidden ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={onToggle}
        />

        <aside
          className={`fixed lg:static top-0 left-0 h-screen bg-sidebar z-40 flex flex-col
          transition-all duration-300 ease-in-out shadow-xl lg:shadow-none border-r border-sidebar-border
          ${isOpen 
            ? "w-64 translate-x-0" 
            : "-translate-x-full lg:translate-x-0 lg:w-20"}
          `}
        >
          {/* Close button mobile */}
          <div className="lg:hidden absolute top-4 right-4">
            <button onClick={onToggle} className="p-2 hover:bg-sidebar-accent rounded-full bg-background/80 border border-border shadow-sm">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Logo / Brand */}
          <div className={`h-16 border-b border-sidebar-border flex items-center transition-all duration-300 ${isOpen ? "px-6" : "justify-center px-0"}`}>
            {isOpen ? (
              <h2 className="text-sm font-bold text-sidebar-foreground uppercase tracking-widest whitespace-nowrap overflow-hidden">
                Movie in the Park
              </h2>
            ) : (
              <span className="text-xl">🎬</span>
            )}
          </div>

          {/* Menu */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle?.()
                    }
                  }}
                  title={!isOpen ? item.label : ""}
                  className={`flex items-center rounded-md transition-all duration-200
                    ${isOpen ? "gap-3 px-4 py-3" : "justify-center py-3 px-0"}
                    ${active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                </Link>
              )
            })}

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`w-full flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 mt-4 border-t border-sidebar-border/50 pt-4 transition-all
                ${isOpen ? "gap-3 px-4 py-3" : "justify-center py-3 px-0"}
              `}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">Déconnexion</span>}
            </button>
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            {isOpen && <p className="text-xs text-center text-sidebar-foreground/50">v0.2.0</p>}
          </div>
        </aside>
      </>
    )
  }
