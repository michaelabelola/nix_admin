import { create } from 'zustand'

type EntityStore = {
  entityID: string | null
  setEntityID: (entityID: string | null) => void
}

export const useEntityStore = create<EntityStore>((set) => ({
  entityID: null,
  setEntityID: (entityID) => set({ entityID }),
}))

export function extractEntityIDFromHostname(hostname: string) {
  const normalized = hostname.trim().toLowerCase()

  if (!normalized || normalized === 'localhost') {
    return null
  }

  const parts = normalized.split('.').filter(Boolean)

  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0] || null
  }

  if (parts.length >= 3) {
    return parts[0] || null
  }

  return null
}

export function isCustomerSubdomain(hostname: string) {
  return extractEntityIDFromHostname(hostname) === 'customer'
}
