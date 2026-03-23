export type Pack = "simple" | "vip" | "couple" | "famille" | "stand"

export interface PackDetails {
  id: Pack
  nameKey: string // clé i18n du nom
  descriptionKey: string // clé i18n de la description
  price: number
  currency: string
  capacity: number
  featureKeys: string[] // liste des clés i18n des features
}

export interface Participant {
  nom: string
  prenom: string
  email?: string
  telephone?: string
}

export interface Reservation {
  id: string
  pack: Pack
  packName: string // From pack_name_snapshot
  packId: string // UUID
  nom: string
  telephone: string
  email: string
  howDidYouKnow?: string
  participants: Participant[]
  status: string
  totalPrice: number
  amountPaid: number
  remainingAmount?: number
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// PACKS — en version i18n-ready
// ------------------------------------------------------------

export const PACKS: Record<Pack, PackDetails> = {
  simple: {
    id: "simple",
    nameKey: "packsDetails.simple.name",
    descriptionKey: "packsDetails.simple.description",
    price: 3000,
    currency: "XAF",
    capacity: 1,
    featureKeys: [
      "packsDetails.simple.features.f1",
      "packsDetails.simple.features.f2",
      "packsDetails.simple.features.f3",
      "packsDetails.simple.features.f4",
      "packsDetails.simple.features.f5",
    ],
  },

  vip: {
    id: "vip",
    nameKey: "packsDetails.vip.name",
    descriptionKey: "packsDetails.vip.description",
    price: 5000,
    currency: "XAF",
    capacity: 1,
    featureKeys: [
      "packsDetails.vip.features.f1",
      "packsDetails.vip.features.f2",
      "packsDetails.vip.features.f3",
      "packsDetails.vip.features.f4",
      "packsDetails.vip.features.f5",
      "packsDetails.vip.features.f6",
      "packsDetails.vip.features.f7",
    ],
  },

  couple: {
    id: "couple",
    nameKey: "packsDetails.couple.name",
    descriptionKey: "packsDetails.couple.description",
    price: 8000,
    currency: "XAF",
    capacity: 2,
    featureKeys: [
      "packsDetails.couple.features.f1",
      "packsDetails.couple.features.f2",
      "packsDetails.couple.features.f3",
      "packsDetails.couple.features.f4",
      "packsDetails.couple.features.f5",
    ],
  },

  famille: {
    id: "famille",
    nameKey: "packsDetails.famille.name",
    descriptionKey: "packsDetails.famille.description",
    price: 10000,
    currency: "XAF",
    capacity: 5,
    featureKeys: [
      "packsDetails.famille.features.f1",
      "packsDetails.famille.features.f2",
      "packsDetails.famille.features.f3",
      "packsDetails.famille.features.f4",
      "packsDetails.famille.features.f5",
      "packsDetails.famille.features.f6",
      "packsDetails.famille.features.f7",
    ],
  },

  stand: {
    id: "stand",
    nameKey: "packsDetails.stand.name",
    descriptionKey: "packsDetails.stand.description",
    price: 20000,
    currency: "XAF",
    capacity: 3,
    featureKeys: [
      "packsDetails.stand.features.f1",
      "packsDetails.stand.features.f2",
      "packsDetails.stand.features.f3",
      "packsDetails.stand.features.f4",
      "packsDetails.stand.features.f5",
      "packsDetails.stand.features.f6",
    ],
  },
}

export interface BackendPack {
  id: string // UUID from database
  name: string
  price: number
  description: string
  capacity: number
  is_active: boolean
  createdAt: string
  updatedAt: string
}
