import { API_URL } from "@/lib/api-config"
import type { BackendPack } from "@/lib/types"

let packsCache: BackendPack[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function fetchPacksFromDatabase(): Promise<BackendPack[]> {
  const now = Date.now()

  // Return cached packs if still valid
  if (packsCache && now - cacheTimestamp < CACHE_DURATION) {
    console.log("[v0] Returning cached packs")
    return packsCache
  }

  try {
    const packUrl = `${API_URL}/packs`
    console.log("[v0] Fetching packs from URL:", packUrl)
    console.log("[v0] API_URL value:", API_URL)

    const response = await fetch(packUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Error response body:", errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("[v0] Packs response:", responseData)

    // Backend returns { status, message, data: [...] }
    const packs = responseData.data || responseData || []
    const activePacks = Array.isArray(packs) ? packs.filter((p: any) => p.is_active !== false) : []

    console.log("[v0] Filtered packs count:", activePacks.length)
    if (activePacks.length > 0) {
      console.log("[v0] First pack structure:", activePacks[0])
    }

    packsCache = activePacks
    cacheTimestamp = now

    console.log("[v0] Successfully fetched packs:", activePacks)
    return activePacks
  } catch (error) {
    console.error("[v0] Error fetching packs from database:", error)
    return []
  }
}

export function getPackById(packId: string): BackendPack | undefined {
  return packsCache?.find((p) => p.id === packId)
}

export function getPackByName(packName: string): BackendPack | undefined {
  return packsCache?.find((p) => p.name.toLowerCase() === packName.toLowerCase())
}

export function clearPacksCache(): void {
  packsCache = null
  cacheTimestamp = 0
}
