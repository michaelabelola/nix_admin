import React, {createContext, useContext, useMemo, useState} from "react"
import {useNavigate} from "@tanstack/react-router"
import {toast} from "sonner"

import type {Organization_RegisterModel} from "#/modules/organization/models/models.ts"

import onboardingOrgApi from "./onboarding.org.api.ts"

type RegistrationDraft = {
    user: Organization_RegisterModel.OrgUser
    data: Organization_RegisterModel.Register
    avatar: File | null
    logo: File | null
    logoDark: File | null
    coverImage: File | null
    coverImageDark: File | null
}

type RegistrationContextValue = {
    draft: RegistrationDraft
    isSubmitting: boolean
    updateUser: (patch: Partial<Organization_RegisterModel.OrgUser>) => void
    updateUserAddress: (patch: Partial<Organization_RegisterModel.OrgUser["address"]>) => void
    updateData: (patch: Partial<Organization_RegisterModel.Register>) => void
    updateDataDetail: (patch: Partial<Organization_RegisterModel.Register["detail"]>) => void
    updateDataAddress: (patch: Partial<Organization_RegisterModel.Register["address"]>) => void
    updateDataContact: (patch: Partial<Organization_RegisterModel.Register["contact"]>) => void
    updateDataSocials: (patch: Partial<Organization_RegisterModel.Register["socials"]>) => void
    setFile: (key: keyof Pick<RegistrationDraft, "avatar" | "logo" | "logoDark" | "coverImage" | "coverImageDark">, file: File | null) => void
    canSubmit: boolean
    submitRegistration: () => Promise<void>
}

const initialDraft: RegistrationDraft = {
    user: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        bio: "",
        address: {
            apt_number: "",
            street: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
            latitude: 0,
            longitude: 0,
        },
    },
    data: {
        name: "",
        shortName: "",
        industry: "",
        bio: "",
        detail: {
            about: "",
            dateEstablished: "",
            registrationNumber: "",
            registrationCountry: "",
        },
        address: {
            apt_number: "",
            street: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
            latitude: 0,
            longitude: 0,
        },
        socials: {
            website: "",
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            youtube: "",
            snapchat: "",
            pinterest: "",
        },
        contact: {
            email: "",
            phone: "",
        },
    },
    avatar: null,
    logo: null,
    logoDark: null,
    coverImage: null,
    coverImageDark: null,
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null)

function normalizeNumber(value: number) {
    return Number.isFinite(value) ? value : 0
}

function trimString(value?: string | Date) {
    if (value instanceof Date) return value.toISOString()
    return value?.trim() ?? ""
}

function canSubmitRegistration(draft: RegistrationDraft) {
    return Boolean(
        trimString(draft.data.name) &&
        trimString(draft.data.shortName) &&
        trimString(draft.data.industry) &&
        trimString(draft.data.detail.registrationCountry) &&
        trimString(draft.data.address.street) &&
        trimString(draft.data.address.city) &&
        trimString(draft.data.address.state) &&
        trimString(draft.data.address.country) &&
        trimString(draft.data.address.zipcode) &&
        trimString(draft.data.contact.email) &&
        trimString(draft.data.contact.phone) &&
        trimString(draft.user.firstname) &&
        trimString(draft.user.lastname) &&
        trimString(draft.user.email) &&
        trimString(draft.user.phone) &&
        trimString(draft.user.address.street) &&
        trimString(draft.user.address.city) &&
        trimString(draft.user.address.state) &&
        trimString(draft.user.address.country) &&
        trimString(draft.user.address.zipcode)
    )
}

export function RegistrationProvider({children}: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const [draft, setDraft] = useState<RegistrationDraft>(initialDraft)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const value = useMemo<RegistrationContextValue>(() => ({
        draft,
        isSubmitting,
        updateUser: (patch) => setDraft((previous) => ({
            ...previous,
            user: {
                ...previous.user,
                ...patch,
            },
        })),
        updateUserAddress: (patch) => setDraft((previous) => ({
            ...previous,
            user: {
                ...previous.user,
                address: {
                    ...previous.user.address,
                    ...patch,
                },
            },
        })),
        updateData: (patch) => setDraft((previous) => ({
            ...previous,
            data: {
                ...previous.data,
                ...patch,
            },
        })),
        updateDataDetail: (patch) => setDraft((previous) => ({
            ...previous,
            data: {
                ...previous.data,
                detail: {
                    ...previous.data.detail,
                    ...patch,
                },
            },
        })),
        updateDataAddress: (patch) => setDraft((previous) => ({
            ...previous,
            data: {
                ...previous.data,
                address: {
                    ...previous.data.address,
                    ...patch,
                },
            },
        })),
        updateDataContact: (patch) => setDraft((previous) => ({
            ...previous,
            data: {
                ...previous.data,
                contact: {
                    ...previous.data.contact,
                    ...patch,
                },
            },
        })),
        updateDataSocials: (patch) => setDraft((previous) => ({
            ...previous,
            data: {
                ...previous.data,
                socials: {
                    ...previous.data.socials,
                    ...patch,
                },
            },
        })),
        setFile: (key, file) => setDraft((previous) => ({
            ...previous,
            [key]: file,
        })),
        canSubmit: canSubmitRegistration(draft),
        submitRegistration: async () => {
            if (isSubmitting) return
            if (!canSubmitRegistration(draft)) {
                toast.error("Complete the required registration details before submitting.")
                return
            }

            try {
                setIsSubmitting(true)
                await onboardingOrgApi.register({
                    user: {
                        ...draft.user,
                        firstname: trimString(draft.user.firstname),
                        lastname: trimString(draft.user.lastname),
                        email: trimString(draft.user.email),
                        phone: trimString(draft.user.phone),
                        dateOfBirth: trimString(draft.user.dateOfBirth),
                        bio: trimString(draft.user.bio),
                        address: {
                            ...draft.user.address,
                            apt_number: trimString(draft.user.address.apt_number),
                            street: trimString(draft.user.address.street),
                            city: trimString(draft.user.address.city),
                            state: trimString(draft.user.address.state),
                            country: trimString(draft.user.address.country),
                            zipcode: trimString(draft.user.address.zipcode),
                            latitude: normalizeNumber(draft.user.address.latitude),
                            longitude: normalizeNumber(draft.user.address.longitude),
                        },
                    },
                    data: {
                        ...draft.data,
                        name: trimString(draft.data.name),
                        shortName: trimString(draft.data.shortName),
                        industry: trimString(draft.data.industry),
                        bio: trimString(draft.data.bio),
                        detail: {
                            ...draft.data.detail,
                            about: trimString(draft.data.detail.about),
                            dateEstablished: trimString(draft.data.detail.dateEstablished),
                            registrationNumber: trimString(draft.data.detail.registrationNumber),
                            registrationCountry: trimString(draft.data.detail.registrationCountry),
                        },
                        address: {
                            ...draft.data.address,
                            apt_number: trimString(draft.data.address.apt_number),
                            street: trimString(draft.data.address.street),
                            city: trimString(draft.data.address.city),
                            state: trimString(draft.data.address.state),
                            country: trimString(draft.data.address.country),
                            zipcode: trimString(draft.data.address.zipcode),
                            latitude: normalizeNumber(draft.data.address.latitude),
                            longitude: normalizeNumber(draft.data.address.longitude),
                        },
                        contact: {
                            email: trimString(draft.data.contact.email),
                            phone: trimString(draft.data.contact.phone),
                        },
                        socials: Object.fromEntries(
                            Object.entries(draft.data.socials).map(([key, value]) => [key, trimString(value)])
                        ) as Organization_RegisterModel.Register["socials"],
                    },
                    avatar: draft.avatar ?? undefined,
                    logo: draft.logo ?? undefined,
                    logoDark: draft.logoDark ?? undefined,
                    coverImage: draft.coverImage ?? undefined,
                    coverImageDark: draft.coverImageDark ?? undefined,
                })
                toast.success("Organization registration submitted successfully.")
                setDraft(initialDraft)
                await navigate({to: "/self/organizations"})
            } catch (error: any) {
                toast.error(error?.message || "Failed to submit organization registration.")
            } finally {
                setIsSubmitting(false)
            }
        },
    }), [draft, isSubmitting, navigate])

    return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>
}

export function useRegistration() {
    const context = useContext(RegistrationContext)
    if (!context) {
        throw new Error("useRegistration must be used within RegistrationProvider")
    }
    return context
}
