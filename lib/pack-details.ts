import { t } from "@/lib/i18n"

type Lang = "fr" | "en"

// Normalisation du nom venant du backend
function normalizePackName(name: string): string {
  if (!name) return ""
  return name.trim().toLowerCase()
}

export function getPackDetails(rawPackName: string, langInput: string) {
  if (!rawPackName) return null

  // Sécurise la langue pour satisfaire TypeScript
  const language: Lang = langInput === "en" ? "en" : "fr"

  const normalized = normalizePackName(rawPackName)

  const translationKeyMap: Record<string, string> = {
    simple: "simple",
    standard: "simple",
    classique: "simple",

    vip: "vip",

    couple: "couple",
    duo: "couple",

    famille: "famille",
    family: "famille",
    "family pack": "famille",

    stand: "stand",
    business: "stand",
    "business stand": "stand",
    entreprise: "stand",
  }

  const translationKey = translationKeyMap[normalized]

  if (!translationKey) {
    console.warn("[pack-details] Pack inconnu ou non mappé :", rawPackName)
    return null
  }

  const baseKey = `packsDetails.${translationKey}`

  try {
    const possibleFeatures = ["f1", "f2", "f3", "f4", "f5", "f6", "f7"]

    const features = possibleFeatures
      .map((f) => t(`${baseKey}.features.${f}`, language))
      .filter((txt) => txt && txt !== `${baseKey}.features.${txt}`)

    return {
      key: translationKey,
      name: t(`${baseKey}.name`, language),
      description: t(`${baseKey}.description`, language),
      features,
    }
  } catch (err) {
    console.warn("[pack-details] Erreur lors du chargement du pack :", rawPackName, err)
    return null
  }
}
