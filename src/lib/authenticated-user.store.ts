import { create } from 'zustand'

import type { NixID } from '#/models/Models'
import type { LoginModel } from '#/modules/auth/signin/Model.ts'

type AuthenticatedUser = {
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

export const useAuthenticatedUserStore = create<AuthenticatedUserStore>(
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
    clearAuthenticatedUser: () => set({ user: null }),
  }),
)
