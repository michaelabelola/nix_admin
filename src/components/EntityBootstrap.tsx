import { useEffect, useLayoutEffect } from 'react'

import { extractEntityIDFromHostname, useEntityStore } from '#/lib/entity.store'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function EntityBootstrap() {
  const setEntityID = useEntityStore((state) => state.setEntityID)

  useIsomorphicLayoutEffect(() => {
    const entityID = extractEntityIDFromHostname(window.location.hostname)
    setEntityID(entityID)
  }, [setEntityID])

  return null
}
