import {useEffect, useState} from 'react'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

import type {NixID} from '#/models/Models'
import type {LoginModel} from '#/modules/auth/signin/Model.ts'

export type AuthenticatedUser = {
    accessToken: string | null
    refreshToken: string | null
    tokenType: string | null
    orgID: NixID | null
}

type AuthenticatedUserStore = {
    user: AuthenticatedUser | null
    setAuthenticatedUser: (user: LoginModel.LoginResponse) => void
    clearAuthenticatedUser: () => void
}

export const useAuthenticatedUserStore = create<AuthenticatedUserStore>()(
    persist(
        (set) => ({
            user: null,
            setAuthenticatedUser: (user) =>
                set({
                    user: {
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        tokenType: user.tokenType,
                        orgID: user.orgID ?? null,
                    },
                }),
            clearAuthenticatedUser: () => set({user: null}),
        }),
        {
            name: 'authenticated-user',
            // storage: createJSONStorage(() => localStorage)
        },
    ),
)

export function useAuthenticatedUser() {
    const user = useAuthenticatedUserStore((state) => state.user)
    const [isHydrated, setIsHydrated] = useState(
        useAuthenticatedUserStore.persist.hasHydrated(),
    )

    useEffect(() => {
        if (useAuthenticatedUserStore.persist.hasHydrated()) {
            setIsHydrated(true)
            return
        }

        const unsubscribeHydrate = useAuthenticatedUserStore.persist.onHydrate(() => {
            setIsHydrated(false)
        })
        const unsubscribeFinishHydration = useAuthenticatedUserStore.persist.onFinishHydration(() => {
            setIsHydrated(true)
        })

        return () => {
            unsubscribeHydrate()
            unsubscribeFinishHydration()
        }
    }, [])

    return {
        user,
        isHydrated,
    }
}
