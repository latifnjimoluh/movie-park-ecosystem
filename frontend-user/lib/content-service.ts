/**
 * content-service.ts
 * ------------------
 * Récupère les contenus dynamiques depuis le backend (films, schedule,
 * témoignages, config événement).  Si le backend est indisponible, les
 * données statiques de secours (fallback) définies dans ce fichier
 * sont utilisées automatiquement — le site reste toujours fonctionnel.
 */

import { API_URL } from "@/lib/api-config"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DbFilm {
  id: string
  title_fr: string
  title_en?: string
  genre_fr?: string
  genre_en?: string
  year?: string
  country_fr?: string
  country_en?: string
  duration?: string
  synopsis_fr?: string
  synopsis_en?: string
  classification_fr?: string
  classification_en?: string
  poster_url?: string
  image_url?: string
  youtube_url?: string
  screening_time?: string
  display_order: number
  is_active: boolean
  updatedAt?: string
}

export interface DbScheduleItem {
  id: string
  time: string
  title_fr: string
  title_en?: string
  description_fr?: string
  description_en?: string
  is_surprise: boolean
  is_after: boolean
  is_teaser: boolean
  /** "enfants" | "encadrants" | undefined — utilisé pour l'affichage des axes orphelins */
  category?: "enfants" | "encadrants" | string
  display_order: number
  is_active: boolean
}

export interface DbTestimonial {
  id: string
  quote_fr: string
  quote_en?: string
  author: string
  pack_name?: string
  edition?: string
  photo_url?: string
  image_url?: string
  rating: number
  is_active: boolean
  display_order: number
  updatedAt?: string
}

/**
 * Résout l'URL d'une image en privilégiant l'upload backend.
 * Ajoute un cache-buster si updatedAt est présent.
 */
export function resolveImageUrl(item: DbFilm | DbTestimonial | any): string {
  const url = item.image_url || item.poster_url || item.photo_url
  if (!url) return "/placeholder.svg"
  
  let finalUrl = url
  
  // Si l'URL n'est pas déjà absolue (ne commence pas par http)
  if (!url.startsWith("http")) {
    // Nettoyer l'URL de l'API pour avoir la base (ex: https://api.xxx.com)
    const backendBase = API_URL.split("/api")[0]
    
    // Nettoyer le chemin de l'image (enlever le ./ au début si présent)
    const cleanUrl = url.replace(/^\.\//, "/").replace(/^\/+/, "/")
    
    finalUrl = `${backendBase}/${cleanUrl}`.replace(/([^:]\/)\/+/g, "$1")
  }

  // Cache busting
  const ts = item.updatedAt ? new Date(item.updatedAt).getTime() : Date.now()
  return finalUrl.includes("?") ? `${finalUrl}&t=${ts}` : `${finalUrl}?t=${ts}`
}

export interface EventConfigMap {
  edition_label: string
  tagline: string
  subtitle: string
  social_proof: string
  location_lat: string
  location_lng: string
  films_badge: string
  films_description: string
  pricing_badge: string
  particle_symbols: string
  contact_phone: string
  contact_email: string
  contact_whatsapp: string
  [key: string]: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Données de secours (utilisées uniquement si le backend est injoignable)
// ─────────────────────────────────────────────────────────────────────────────

export const FALLBACK_FILMS: DbFilm[] = [
  {
    id: "fallback-1",
    title_fr: "Zootopie 2 (2025)",
    title_en: "Zootopia 2 (2025)",
    genre_fr: "Famille, Animation, Comédie, Aventure",
    genre_en: "Family, Animation, Comedy, Adventure",
    year: "2025",
    country_fr: "États-Unis",
    country_en: "United States",
    duration: "115 min",
    synopsis_fr:
      "Dans cette suite très attendue, Judy Hopps et Nick Wilde reprennent du service pour faire face à une nouvelle affaire qui menace l'équilibre de la ville de Zootopie.",
    synopsis_en:
      "In this long-awaited sequel, Judy Hopps and Nick Wilde are back on the case to face a new threat to the balance of Zootopia.",
    classification_fr: "Tout public",
    classification_en: "All audiences",
    poster_url: "/zootopie.jpeg",
    youtube_url: "#",
    screening_time: "18h30",
    display_order: 0,
    is_active: true,
  },
  {
    id: "fallback-2",
    title_fr: "Saw IV (2007)",
    title_en: "Saw IV (2007)",
    genre_fr: "Horreur, Thriller, Mystère",
    genre_en: "Horror, Thriller, Mystery",
    year: "2007",
    country_fr: "Royaume-Uni | États-Unis | Canada",
    country_en: "United Kingdom | United States | Canada",
    duration: "93 min",
    synopsis_fr:
      "Alors que le tueur au puzzle Jigsaw semble avoir disparu, une nouvelle série de jeux macabres débute. L'enquête plonge au cœur d'un réseau complexe de choix moraux et de pièges redoutables.",
    synopsis_en:
      "As the Jigsaw killer appears to have died, a new series of macabre traps begins. The investigation dives into a complex web of moral choices and deadly traps.",
    classification_fr: "Interdit aux moins de 18 ans",
    classification_en: "18+",
    poster_url: "/saw.jpeg",
    youtube_url: "#",
    screening_time: "22h00",
    display_order: 1,
    is_active: true,
  },
]

export const FALLBACK_SCHEDULE: DbScheduleItem[] = [
  {
    id: "fs-1",
    time: "13h00 – 15h00",
    title_fr: "🧒 Activités Enfants — Jeux & Animations",
    title_en: "🧒 Children's Activities — Games & Animations",
    description_fr: "Activités ludiques à venir — jeux, ateliers créatifs et animations spécialement conçus pour les orphelins participants.",
    description_en: "Coming soon — games, creative workshops and entertainment specially designed for the orphaned children attending.",
    is_surprise: false, is_after: false, is_teaser: false,
    category: "enfants",
    display_order: 0, is_active: true,
  },
  {
    id: "fs-2",
    time: "15h00 – 17h00",
    title_fr: "👥 Espace Encadrants — Atelier & Échanges",
    title_en: "👥 Caregivers Space — Workshop & Exchanges",
    description_fr: "Session d'échange encadrants à venir — ateliers, discussions et partages d'expériences pour le personnel des orphelinats.",
    description_en: "Coming soon — workshops, discussions and experience sharing for orphanage staff.",
    is_surprise: false, is_after: false, is_teaser: false,
    category: "encadrants",
    display_order: 1, is_active: true,
  },
  {
    id: "fs-3",
    time: "17h30",
    title_fr: "Ouverture des portes — Grand Public",
    title_en: "Doors Open — General Public",
    description_fr: "Accueil du public, installation et préparation pour les projections",
    description_en: "Public welcome, seating, and preparation for the screenings",
    is_surprise: false, is_after: false, is_teaser: false, display_order: 2, is_active: true,
  },
  {
    id: "fs-4",
    time: "18h30",
    title_fr: "Premier Film",
    title_en: "First Movie",
    description_fr: "Zootopie 2 (2025) — séance famille, orphelins et encadrants aux premières loges",
    description_en: "Zootopia 2 (2025) — family screening, orphans and caregivers in front seats",
    is_surprise: false, is_after: false, is_teaser: false, display_order: 3, is_active: true,
  },
  {
    id: "fs-5",
    time: "21h00",
    title_fr: "Pause & Animations Solidaires",
    title_en: "Break & Solidarity Animations",
    description_fr: "Repas, photobooth, mini-concours solidaires et rafraîchissements",
    description_en: "Food, photobooth, solidarity mini-contests and refreshments",
    is_surprise: false, is_after: false, is_teaser: false, display_order: 4, is_active: true,
  },
  {
    id: "fs-6",
    time: "22h00",
    title_fr: "Deuxième Film",
    title_en: "Second Movie",
    description_fr: "Saw IV — séance nocturne (public adulte)",
    description_en: "Saw IV — night screening (adult audience only)",
    is_surprise: true, is_after: true, is_teaser: true, display_order: 5, is_active: true,
  },
  {
    id: "fs-7",
    time: "00h00+",
    title_fr: "Clôture & Remerciements",
    title_en: "Closing & Thank You",
    description_fr: "Fin de l'événement — remerciements aux orphelinats partenaires et remise symbolique des fonds collectés",
    description_en: "End of event — acknowledgement of partner orphanages and symbolic donation handover",
    is_surprise: false, is_after: false, is_teaser: false, display_order: 6, is_active: true,
  },
]

export const FALLBACK_TESTIMONIALS: DbTestimonial[] = [
  {
    id: "ft-1",
    quote_fr: "Une expérience magique ! L'organisation était impeccable, l'ambiance chaleureuse, et les films excellents. Nous reviendrons avec plaisir pour la prochaine édition.",
    quote_en: "A magical experience! The organization was impeccable, the atmosphere warm, and the films excellent. We will definitely come back for the next edition.",
    author: "Brooklyn",
    pack_name: "Pack Famille",
    edition: "Decembre 2024",
    photo_url: "/man-profile.jpg",
    rating: 5,
    is_active: true,
    display_order: 0,
  },
  {
    id: "ft-2",
    quote_fr: "Le concept est génial. Entre le DJ set, les films et l'ambiance conviviale, c'était une soirée parfaite. Le pack VIP vaut vraiment le coup !",
    quote_en: "The concept is brilliant. Between the DJ set, the films and the friendly atmosphere, it was a perfect evening. The VIP pack is really worth it!",
    author: "Dorian",
    pack_name: "Pack VIP",
    edition: "Decembre 2024",
    photo_url: "/dorian.jpg",
    rating: 5,
    is_active: true,
    display_order: 1,
  },
  {
    id: "ft-3",
    quote_fr: "Date night parfaite ! Le pack Couple avec le matelas double et la photo souvenir a rendu notre soirée encore plus spéciale. À refaire absolument.",
    quote_en: "Perfect date night! The Couple pack with the double mattress and souvenir photo made our evening even more special. Definitely doing it again.",
    author: "Sammy",
    pack_name: "Pack Couple",
    edition: "Decembre 2024",
    photo_url: "/sammy.jpg",
    rating: 5,
    is_active: true,
    display_order: 2,
  },
]

export const FALLBACK_EVENT_CONFIG: EventConfigMap = {
  edition_label:     "🤍 Édition Spéciale Orphelins — 17 Avril 2026",
  tagline:           "Le cinéma au service du cœur — Soutenez les orphelins avec Movie in the Park",
  subtitle:          "Solidarité · Films · Expérience Caritative — 17 Avril 2026",
  social_proof:      "🎟️ Plus de 100 participants lors de la dernière édition",
  location_lat:      "3.876146",
  location_lng:      "11.518691",
  films_badge:       "🎬 Programme 17 Avril 2026",
  films_description: "Deux films soigneusement sélectionnés pour une soirée inoubliable au service des orphelins.",
  pricing_badge:     "🎟️ Choisissez votre expérience",
  particle_symbols:  JSON.stringify(["🤍", "🕊️", "🌸", "⭐", "✨", "🌿", "🌺", "💫", "🙏", "🌱"]),
  contact_phone:     "+237 697 30 44 50",
  contact_email:     "matangabrooklyn@gmail.com",
  contact_whatsapp:  "237697304450",
}

// ─────────────────────────────────────────────────────────────────────────────
// Fonctions de fetch avec fallback automatique
// ─────────────────────────────────────────────────────────────────────────────

async function safeFetch<T>(url: string, fallback: T): Promise<{ data: T; fromFallback: boolean }> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Cache 60 s côté Next (ISR-like) — ignoré si le serveur est indisponible
      next: { revalidate: 60 },
    } as RequestInit)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const raw = json.data ?? json
    // Pour les tableaux, on vérifie qu'il y a bien des données
    if (Array.isArray(fallback) && Array.isArray(raw) && raw.length === 0) {
      return { data: fallback, fromFallback: true }
    }
    return { data: raw as T, fromFallback: false }
  } catch {
    return { data: fallback, fromFallback: true }
  }
}

export async function fetchFilms(): Promise<{ films: DbFilm[]; fromFallback: boolean }> {
  const { data, fromFallback } = await safeFetch<DbFilm[]>(
    `${API_URL}/films?is_active=true`,
    FALLBACK_FILMS,
  )
  return { films: data, fromFallback }
}

export async function fetchSchedule(): Promise<{ items: DbScheduleItem[]; fromFallback: boolean }> {
  const { data, fromFallback } = await safeFetch<DbScheduleItem[]>(
    `${API_URL}/schedule?is_active=true`,
    FALLBACK_SCHEDULE,
  )
  return { items: data, fromFallback }
}

export async function fetchTestimonials(): Promise<{ testimonials: DbTestimonial[]; fromFallback: boolean }> {
  const { data, fromFallback } = await safeFetch<DbTestimonial[]>(
    `${API_URL}/testimonials?is_active=true`,
    FALLBACK_TESTIMONIALS,
  )
  return { testimonials: data, fromFallback }
}

export async function fetchEventConfig(): Promise<{ config: EventConfigMap; fromFallback: boolean }> {
  const { data, fromFallback } = await safeFetch<EventConfigMap>(
    `${API_URL}/event-config/public`,
    FALLBACK_EVENT_CONFIG,
  )
  return { config: data as EventConfigMap, fromFallback }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de localisation
// ─────────────────────────────────────────────────────────────────────────────

export function filmTitle(film: DbFilm, lang: string)         { return lang === "en" && film.title_en         ? film.title_en         : film.title_fr }
export function filmGenre(film: DbFilm, lang: string)         { return lang === "en" && film.genre_en         ? film.genre_en         : film.genre_fr ?? "" }
export function filmCountry(film: DbFilm, lang: string)       { return lang === "en" && film.country_en       ? film.country_en       : film.country_fr ?? "" }
export function filmSynopsis(film: DbFilm, lang: string)      { return lang === "en" && film.synopsis_en      ? film.synopsis_en      : film.synopsis_fr ?? "" }
export function filmClassification(film: DbFilm, lang: string){ return lang === "en" && film.classification_en? film.classification_en: film.classification_fr ?? "" }

export function scheduleTitle(item: DbScheduleItem, lang: string)       { return lang === "en" && item.title_en       ? item.title_en       : item.title_fr }
export function scheduleDescription(item: DbScheduleItem, lang: string) { return lang === "en" && item.description_en ? item.description_en : item.description_fr ?? "" }

export function testimonialQuote(t: DbTestimonial, lang: string) { return lang === "en" && t.quote_en ? t.quote_en : t.quote_fr }
