"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/admin/stat-card"
import { Users, CreditCard, AlertCircle, Ticket, Check } from "lucide-react"

interface Stats {
  totalReservations: number
  totalCollected: number
  partialPayments: number
  ticketsGenerated: number
  entriesValidated: number
}

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api"

async function fetchStats(): Promise<Stats> {
  const token = localStorage.getItem("admin_token")
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${BASE_URL}/reservations?limit=1000`, { headers })
  if (!res.ok) throw new Error("Failed to fetch reservations")
  const json = await res.json()
  const reservations: any[] = json.data?.reservations || json.data || []

  let totalCollected = 0
  let partialPayments = 0
  let ticketsGenerated = 0
  let entriesValidated = 0

  for (const r of reservations) {
    totalCollected += r.total_paid || 0
    if ((r.total_paid || 0) < (r.total_price || 0)) partialPayments++
    if (r.status === "ticket_generated") ticketsGenerated++
    const participants: any[] = r.participants || []
    entriesValidated += participants.filter((p) => p.entrance_validated).length
  }

  return {
    totalReservations: reservations.length,
    totalCollected,
    partialPayments,
    ticketsGenerated,
    entriesValidated,
  }
}

export function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((e) => {
        console.error("[StatsGrid]", e)
        setError("Impossible de charger les statistiques.")
      })
  }, [])

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
        {error}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Réservations",
      icon: Users,
      value: stats?.totalReservations ?? 0,
      gradient: "from-[#e3e9ff] to-[#d6dfff]",
      textColor: "text-[#3b4d8c]",
      iconColor: "text-[#5a6fb8]",
    },
    {
      title: "Total Encaissé",
      icon: CreditCard,
      value: stats?.totalCollected ?? 0,
      format: (val: number) => `${val.toLocaleString("fr-FR")} XAF`,
      gradient: "from-[#e5f6ea] to-[#d9eedf]",
      textColor: "text-[#3b7a4e]",
      iconColor: "text-[#58a879]",
    },
    {
      title: "Paiements partiels",
      icon: AlertCircle,
      value: stats?.partialPayments ?? 0,
      gradient: "from-[#f9f2d9] to-[#f3e8c3]",
      textColor: "text-[#8a6d1f]",
      iconColor: "text-[#d6b444]",
    },
    {
      title: "Tickets générés",
      icon: Ticket,
      value: stats?.ticketsGenerated ?? 0,
      gradient: "from-[#f1e4fb] to-[#e9d7f7]",
      textColor: "text-[#7b4ca0]",
      iconColor: "text-[#b07cd5]",
    },
    {
      title: "Entrées validées",
      icon: Check,
      value: stats?.entriesValidated ?? 0,
      gradient: "from-[#fde4e4] to-[#f7d3d3]",
      textColor: "text-[#9b3a3a]",
      iconColor: "text-[#d66a6a]",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.title}
          stat={{ ...stat, displayValue: stat.value }}
          delay={index * 100}
        />
      ))}
    </div>
  )
}
