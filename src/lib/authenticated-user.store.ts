import {useEffect, useState} from 'react'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

import type {NixID} from '#/models/Models'
import type {LoginModel} from '#/modules/auth/signin/Model.ts'
import {useNavigate} from "@tanstack/react-router";

export type AuthenticatedUser = {
    accessToken: string | null
    refreshToken: string | null
    tokenType: string | null
    orgID: NixID | null
    userID: string
    proxyUserID?: string | null
}

type AuthenticatedUserStore = {
    user: AuthenticatedUser | null
    setAuthenticatedUser: (user: LoginModel.LoginResponse & { __options?: { isProxy?: boolean } }) => void
    clearAuthenticatedUser: () => void
}

export const useLogout = () => {
    const navigate = useNavigate()
    const {clearAuthenticatedUser} = useAuthenticatedUserStore()
    return {
        logout: () => {
            clearAuthenticatedUser()
            navigate({
                to: "/"
            })
        }
    }
}

export const useAuthenticatedUserStore = create<AuthenticatedUserStore>()(
    persist(
        (set, get) => ({
            user: null,
            setAuthenticatedUser: (user) =>
                set({
                    user: {
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        tokenType: user.tokenType,
                        orgID: user.orgID ?? null,
                        userID: user.userID,
                        proxyUserID: user?.__options?.isProxy ? get().user?.userID : null
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
    const persistApi = useAuthenticatedUserStore.persist
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        if (!persistApi) {
            setIsHydrated(true)
            return
        }

        if (persistApi.hasHydrated()) {
            setIsHydrated(true)
            return
        }

        const unsubscribeHydrate = persistApi.onHydrate(() => {
            setIsHydrated(false)
        })
        const unsubscribeFinishHydration = persistApi.onFinishHydration(() => {
            setIsHydrated(true)
        })

        return () => {
            unsubscribeHydrate()
            unsubscribeFinishHydration()
        }
    }, [persistApi])

    return {
        user,
        isHydrated,
    }
}
