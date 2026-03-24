import { type Participant, PACKS } from "./types"
import { API_URL } from "./api-config"

export { PACKS }

let packsCache: Record<string, string> | null = null

async function getPacksFromBackend(): Promise<Record<string, string>> {
  if (packsCache) {
    return packsCache
  }

  try {
    console.log("[v0] Fetching packs from backend...")
    const response = await fetch(`${API_URL}/packs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch packs:", response.statusText)
      throw new Error("Failed to fetch packs")
    }

    const data = await response.json()
    const packs = data.data?.packs || data || []

    // Map pack names to their UUIDs
    const packMap: Record<string, string> = {}
    for (const pack of packs) {
      const packKey = pack.name.toLowerCase()
      packMap[packKey] = pack.id
      console.log("[v0] Pack mapping:", { name: pack.name, id: pack.id })
    }

    packsCache = packMap
    return packMap
  } catch (error) {
    console.error("[v0] Error fetching packs:", error)
    throw new Error("Unable to load pack information from server")
  }
}

const RESERVATIONS_KEY = "movie_in_park_reservations"
const COUNTER_KEY = "movie_in_park_id_counter"

export async function getAllReservations(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch reservations:", response.statusText)
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("[v0] Error fetching reservations:", error)
    return []
  }
}

export function formatWhatsAppMessage(message: string): string {
  // WhatsApp supports *bold*, _italic_, and ~strikethrough~
  // This function returns the formatted message string
  // Usage: formatWhatsAppMessage("Hello *bold text* and _italic text_")
  return message
}

export async function createReservation(
  packId: string,
  nom: string,
  prenom: string,
  telephone: string,
  email: string,
  participants: Participant[],
  howDidYouKnow?: string,
): Promise<any> {
  try {
    console.log("[v0] Creating reservation with packId:", packId)

    const fullName = `${prenom} ${nom}`.trim()

    let formattedPhone = telephone
    if (!formattedPhone.startsWith("237")) {
      formattedPhone = "237" + formattedPhone
    }

    const formattedParticipants = [
      {
        name: fullName,
        phone: formattedPhone,
        email: email || "",
      },
      ...participants.map((p) => ({
        name: `${p.prenom} ${p.nom}`.trim(),
        phone: p.telephone || "",
        email: p.email || "",
      })),
    ]

    const payload = {
      payeur_name: fullName,
      payeur_phone: formattedPhone,
      payeur_email: email || "",
      pack_id: packId,
      quantity: formattedParticipants.length,
      participants: formattedParticipants,
    }

    console.log("[v0] Reservation payload:", payload)

    // ✅ CHANGEMENT ICI : Utiliser /public au lieu de /reservations
    const response = await fetch(`${API_URL}/reservations/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] API Error Response:", errorData)
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Reservation response:", data)

    const backendReservation = data.data?.reservation || data.data

    const transformedReservation = {
      id: backendReservation.id,
      packName: backendReservation.pack_name_snapshot,
      packId: backendReservation.pack_id,
      nom: backendReservation.payeur_name,
      telephone: backendReservation.payeur_phone,
      email: backendReservation.payeur_email,
      totalPrice: backendReservation.total_price,
      amountPaid: backendReservation.total_paid,
      remainingAmount: backendReservation.remaining_amount,
      status: backendReservation.status,
      participants: backendReservation.participants || [],
      createdAt: backendReservation.createdAt,
      updatedAt: backendReservation.updatedAt,
    }

    return transformedReservation
  } catch (error) {
    console.error("[v0] Error creating reservation:", error)
    throw error
  }
}
export async function getReservationById(id: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Reservation not found:", id)
      return null
    }

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error("[v0] Error fetching reservation:", error)
    return null
  }
}

export async function getReservationsByPhone(phone: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/reservations/track?phone=${encodeURIComponent(phone)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch reservations by phone")
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("[v0] Error fetching reservations by phone:", error)
    return []
  }
}

// Generate unique reservation ID (fallback for frontend)
function generateReservationId(): string {
  if (typeof window === "undefined") return ""

  let counter = Number.parseInt(localStorage.getItem(COUNTER_KEY) || "1000", 10)
  counter++
  localStorage.setItem(COUNTER_KEY, counter.toString())
  return `RES${counter}`
}
