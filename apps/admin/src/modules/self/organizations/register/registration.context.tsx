import React, {createContext, useContext, useMemo, useState} from "react"
import {useNavigate} from "@tanstack/react-router"
import {toast} from "sonner"

import {OrganizationModel, type Organization_RegisterModel} from "@suiteonix/server"

import {orgOnboardingApi as onboardingOrgApi} from "@suiteonix/server"
import defaultData from "#/DefaultData.ts";

type RegistrationDraft = {
    user: Organization_RegisterModel.OrgUser
    data: Organization_RegisterModel.Register
    avatar: File | null
    logo: File | null
    coverImage: File | null
}

type RegistrationContactPatch = Partial<{
    email: string
    phone: string
    whatsapp: string
}>

type RegistrationContextValue = {
    draft: RegistrationDraft
    isSubmitting: boolean
    updateUser: (patch: Partial<Organization_RegisterModel.OrgUser>) => void
    updateUserAddress: (patch: Partial<Organization_RegisterModel.OrgUser["address"]>) => void
    updateData: (patch: Partial<Organization_RegisterModel.Register>) => void
    updateDataDetail: (patch: Partial<Organization_RegisterModel.Register["detail"]>) => void
    updateDataAddress: (patch: Partial<Organization_RegisterModel.Register["address"]>) => void
    updateDataContact: (patch: RegistrationContactPatch) => void
    updateDataSocials: (name: string, value: string) => void
    setFile: (key: keyof Pick<RegistrationDraft, "avatar" | "logo" | "coverImage">, file: File | null) => void
    canSubmit: boolean
    submitRegistration: () => Promise<void>
}

export const REGISTRATION_SOCIAL_ACCOUNTS = [
    {name: "website", label: "Website"},
    {name: "facebook", label: "Facebook"},
    {name: "twitter", label: "Twitter / X"},
    {name: "instagram", label: "Instagram"},
    {name: "linkedin", label: "LinkedIn"},
    {name: "youtube", label: "YouTube"},
    {name: "snapchat", label: "Snapchat"},
    {name: "pinterest", label: "Pinterest"},
] as const

const CONTACT_METHOD_ORDER = [
    OrganizationModel.ContactMethod.EMAIL,
    OrganizationModel.ContactMethod.PHONE,
    OrganizationModel.ContactMethod.WHATSAPP,
]

function createInitialContacts(): OrganizationModel.Contact[] {
    return CONTACT_METHOD_ORDER.map((method) => ({
        method,
        value: "",
        lifecycleStatus: OrganizationModel.LifecycleStatus.ACTIVE,
    }))
}

function createInitialSocials(): OrganizationModel.SocialAccount[] {
    return REGISTRATION_SOCIAL_ACCOUNTS.map(({name}) => ({
        name,
        value: "",
        lifecycleStatus: OrganizationModel.LifecycleStatus.ACTIVE,
    }))
}

function createInitialDraft(): RegistrationDraft {
    const currentLocation = defaultData.getState().location

    return {
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
                state: currentLocation.state,
                country: currentLocation.country,
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
                registrationCountry: currentLocation.country,
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
            email: "",
            phone: "",
            contacts: createInitialContacts(),
            socials: createInitialSocials(),
        },
        avatar: null,
        logo: null,
        coverImage: null,
    }
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null)

function normalizeNumber(value: number) {
    return Number.isFinite(value) ? value : 0
}

function trimString(value?: string | Date | null) {
    if (value instanceof Date) return value.toISOString()
    return value?.trim() ?? ""
}

function optionalString(value?: string | Date | null) {
    const trimmed = trimString(value)
    return trimmed || undefined
}

export function getRegistrationContactValue(
    contacts: OrganizationModel.Contact[] | undefined,
    method: OrganizationModel.ContactMethod,
) {
    return contacts?.find((contact) => contact.method === method)?.value ?? ""
}

function sortContacts(contacts: OrganizationModel.Contact[]) {
    return [...contacts].sort((left, right) => {
        const leftIndex = CONTACT_METHOD_ORDER.indexOf(left.method)
        const rightIndex = CONTACT_METHOD_ORDER.indexOf(right.method)
        return (leftIndex === -1 ? CONTACT_METHOD_ORDER.length : leftIndex) - (rightIndex === -1 ? CONTACT_METHOD_ORDER.length : rightIndex)
    })
}

function setContactValue(
    contacts: OrganizationModel.Contact[] | undefined,
    method: OrganizationModel.ContactMethod,
    value: string,
) {
    const currentContacts = contacts ?? []
    const existing = currentContacts.find((contact) => contact.method === method)
    const nextContact: OrganizationModel.Contact = {
        ...existing,
        method,
        value,
        lifecycleStatus: existing?.lifecycleStatus ?? OrganizationModel.LifecycleStatus.ACTIVE,
    }

    return sortContacts([
        ...currentContacts.filter((contact) => contact.method !== method),
        nextContact,
    ])
}

function setSocialAccountValue(
    socials: OrganizationModel.SocialAccount[] | undefined,
    name: string,
    value: string,
) {
    const currentSocials = socials ?? []
    const existing = currentSocials.find((social) => social.name === name)
    const nextSocial: OrganizationModel.SocialAccount = {
        ...existing,
        name,
        value,
        lifecycleStatus: existing?.lifecycleStatus ?? OrganizationModel.LifecycleStatus.ACTIVE,
    }

    return REGISTRATION_SOCIAL_ACCOUNTS.map((account) => account.name === name ? nextSocial : currentSocials.find((social) => social.name === account.name) ?? {
        name: account.name,
        value: "",
        lifecycleStatus: OrganizationModel.LifecycleStatus.ACTIVE,
    })
}

function buildContacts(draft: RegistrationDraft) {
    const email = trimString(draft.data.email)
    const phone = trimString(draft.data.phone)
    const contacts = setContactValue(
        setContactValue(draft.data.contacts, OrganizationModel.ContactMethod.EMAIL, email),
        OrganizationModel.ContactMethod.PHONE,
        phone,
    )

    return contacts
        .map((contact) => ({
            ...contact,
            value: trimString(contact.value),
            lifecycleStatus: contact.lifecycleStatus ?? OrganizationModel.LifecycleStatus.ACTIVE,
        }))
        .filter((contact) => contact.value)
}

function buildSocials(socials: OrganizationModel.SocialAccount[] | undefined) {
    return (socials ?? [])
        .map((social) => ({
            ...social,
            name: trimString(social.name),
            value: trimString(social.value),
            lifecycleStatus: social.lifecycleStatus ?? OrganizationModel.LifecycleStatus.ACTIVE,
        }))
        .filter((social) => social.name && social.value)
}

function canSubmitRegistration(draft: RegistrationDraft) {
    return Boolean(
        trimString(draft.data.name) &&
        trimString(draft.data.shortName) &&
        trimString(draft.data.industry) &&
        trimString(draft.data.bio) &&
        trimString(draft.data.detail.registrationCountry) &&
        trimString(draft.data.address.street) &&
        trimString(draft.data.address.city) &&
        trimString(draft.data.address.state) &&
        trimString(draft.data.address.country) &&
        trimString(draft.data.address.zipcode) &&
        trimString(draft.data.email) &&
        trimString(draft.data.phone) &&
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
    const [draft, setDraft] = useState<RegistrationDraft>(() => createInitialDraft())
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
        updateDataContact: (patch) => setDraft((previous) => {
            let contacts = previous.data.contacts

            if (patch.email !== undefined) {
                contacts = setContactValue(contacts, OrganizationModel.ContactMethod.EMAIL, patch.email)
            }
            if (patch.phone !== undefined) {
                contacts = setContactValue(contacts, OrganizationModel.ContactMethod.PHONE, patch.phone)
            }
            if (patch.whatsapp !== undefined) {
                contacts = setContactValue(contacts, OrganizationModel.ContactMethod.WHATSAPP, patch.whatsapp)
            }

            return {
                ...previous,
                data: {
                    ...previous.data,
                    email: patch.email !== undefined ? patch.email : previous.data.email,
                    phone: patch.phone !== undefined ? patch.phone : previous.data.phone,
                    contacts,
                },
            }
        }),
        updateDataSocials: (name, value) => setDraft((previous) => ({
            ...previous,
            data: {
                ...previous.data,
                socials: setSocialAccountValue(previous.data.socials, name, value),
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
                        dateOfBirth: optionalString(draft.user.dateOfBirth) ?? "",
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
                            about: optionalString(draft.data.detail.about),
                            dateEstablished: optionalString(draft.data.detail.dateEstablished),
                            registrationNumber: optionalString(draft.data.detail.registrationNumber),
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
                        email: trimString(draft.data.email),
                        phone: trimString(draft.data.phone),
                        contacts: buildContacts(draft),
                        socials: buildSocials(draft.data.socials),
                    },
                    avatar: draft.avatar ?? undefined,
                    logo: draft.logo ?? undefined,
                    coverImage: draft.coverImage ?? undefined,
                })
                toast.success("Organization registration submitted successfully.")
                setDraft(createInitialDraft())
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
