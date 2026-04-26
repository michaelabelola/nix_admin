import React, {createContext, useContext, useMemo, useState} from "react"
import {useNavigate} from "@tanstack/react-router"
import {toast} from "sonner"

import {CustomerModel} from "#/modules/customer/model.ts"
import {CustomerRequest} from "#/modules/customer/request.hook.ts"

type DraftAddress = {
    label: string
    line1: string
    line2: string
    city: string
    state: string
    province: string
    postalCode: string
    country: string
    latitude: string
    longitude: string
}

type DraftPersonalDetail = {
    firstName: string
    middleName: string
    lastName: string
    title: string
    gender: string
    dateOfBirth: string
    nationality: string
    passportNumber: string
    nationalID: string
    maritalStatus: string
    mothersMaidenName: string
    countryOfBirth: string
    profession: string
}

type DraftBusinessDetail = {
    companyName: string
    registrationNumber: string
    taxID: string
    industry: string
    companySize: string
    businessType: string
    legalForm: string
    registrationDate: string
}

type DraftContact = {
    email: string
    secondaryEmail: string
    phoneNumber: string
    mobileNumber: string
    faxNumber: string
    website: string
}

type DraftPreferences = {
    marketingConsent: boolean
    emailNotifications: boolean
    smsNotifications: boolean
}

export type CustomerCreateDraft = {
    externalId: string
    displayName: string
    type: CustomerModel.CustomerType
    lifecycleStage: CustomerModel.CustomerLifecycleStage
    language: string
    timezone: string
    personalDetail: DraftPersonalDetail
    businessDetail: DraftBusinessDetail
    contact: DraftContact
    billingAddress: DraftAddress
    shippingAddress: DraftAddress
    preferences: DraftPreferences
    tags: string[]
    segmentIds: string[]
}

type CustomerCreateContextValue = {
    draft: CustomerCreateDraft
    isSubmitting: boolean
    canSubmit: boolean
    updateDraft: (patch: Partial<CustomerCreateDraft>) => void
    updatePersonalDetail: (patch: Partial<DraftPersonalDetail>) => void
    updateBusinessDetail: (patch: Partial<DraftBusinessDetail>) => void
    updateContact: (patch: Partial<DraftContact>) => void
    updateBillingAddress: (patch: Partial<DraftAddress>) => void
    updateShippingAddress: (patch: Partial<DraftAddress>) => void
    updatePreferences: (patch: Partial<DraftPreferences>) => void
    setTags: (tags: string[]) => void
    setSegmentIds: (segmentIds: string[]) => void
    copyBillingToShipping: () => void
    submitDraft: () => Promise<void>
    resetDraft: () => void
}

const EMPTY_ADDRESS: DraftAddress = {
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    province: "",
    postalCode: "",
    country: "",
    latitude: "",
    longitude: "",
}

const INITIAL_DRAFT: CustomerCreateDraft = {
    externalId: "",
    displayName: "",
    type: CustomerModel.CustomerType.INDIVIDUAL,
    lifecycleStage: CustomerModel.CustomerLifecycleStage.LEAD,
    language: "",
    timezone: "",
    personalDetail: {
        firstName: "",
        middleName: "",
        lastName: "",
        title: "",
        gender: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        nationalID: "",
        maritalStatus: "",
        mothersMaidenName: "",
        countryOfBirth: "",
        profession: "",
    },
    businessDetail: {
        companyName: "",
        registrationNumber: "",
        taxID: "",
        industry: "",
        companySize: "",
        businessType: "",
        legalForm: "",
        registrationDate: "",
    },
    contact: {
        email: "",
        secondaryEmail: "",
        phoneNumber: "",
        mobileNumber: "",
        faxNumber: "",
        website: "",
    },
    billingAddress: {...EMPTY_ADDRESS},
    shippingAddress: {...EMPTY_ADDRESS},
    preferences: {
        marketingConsent: false,
        emailNotifications: false,
        smsNotifications: false,
    },
    tags: [],
    segmentIds: [],
}

const CustomerCreateContext = createContext<CustomerCreateContextValue | null>(null)

function trimString(value?: string | null) {
    return value?.trim() ?? ""
}

function optionalString(value?: string | null) {
    const normalized = trimString(value)
    return normalized ? normalized : undefined
}

function optionalNumber(value?: string | null) {
    const normalized = trimString(value)
    if (!normalized) return undefined
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : undefined
}

function compactObject<T extends Record<string, unknown>>(value: T) {
    const hasValue = Object.values(value).some((entry) => {
        if (entry === undefined || entry === null) return false
        if (typeof entry === "string") return entry.trim().length > 0
        if (Array.isArray(entry)) return entry.length > 0
        if (typeof entry === "object") return true
        return true
    })

    return hasValue ? value : undefined
}

function buildRequestBody(draft: CustomerCreateDraft): CustomerModel.Create {
    return {
        externalId: optionalString(draft.externalId),
        displayName: trimString(draft.displayName),
        type: draft.type,
        lifecycleStage: draft.lifecycleStage,
        language: optionalString(draft.language),
        timezone: optionalString(draft.timezone),
        personalDetail: compactObject({
            firstName: optionalString(draft.personalDetail.firstName),
            middleName: optionalString(draft.personalDetail.middleName),
            lastName: optionalString(draft.personalDetail.lastName),
            title: optionalString(draft.personalDetail.title),
            gender: optionalString(draft.personalDetail.gender),
            dateOfBirth: optionalString(draft.personalDetail.dateOfBirth),
            nationality: optionalString(draft.personalDetail.nationality),
            passportNumber: optionalString(draft.personalDetail.passportNumber),
            nationalID: optionalString(draft.personalDetail.nationalID),
            maritalStatus: optionalString(draft.personalDetail.maritalStatus),
            mothersMaidenName: optionalString(draft.personalDetail.mothersMaidenName),
            countryOfBirth: optionalString(draft.personalDetail.countryOfBirth),
            profession: optionalString(draft.personalDetail.profession),
        }),
        businessDetail: compactObject({
            companyName: optionalString(draft.businessDetail.companyName),
            registrationNumber: optionalString(draft.businessDetail.registrationNumber),
            taxID: optionalString(draft.businessDetail.taxID),
            industry: optionalString(draft.businessDetail.industry),
            companySize: optionalNumber(draft.businessDetail.companySize),
            businessType: optionalString(draft.businessDetail.businessType),
            legalForm: optionalString(draft.businessDetail.legalForm),
            registrationDate: optionalString(draft.businessDetail.registrationDate),
        }),
        contact: compactObject({
            email: optionalString(draft.contact.email),
            secondaryEmail: optionalString(draft.contact.secondaryEmail),
            phoneNumber: optionalString(draft.contact.phoneNumber),
            mobileNumber: optionalString(draft.contact.mobileNumber),
            faxNumber: optionalString(draft.contact.faxNumber),
            website: optionalString(draft.contact.website),
        }),
        billingAddress: compactObject({
            label: optionalString(draft.billingAddress.label),
            line1: optionalString(draft.billingAddress.line1),
            line2: optionalString(draft.billingAddress.line2),
            city: optionalString(draft.billingAddress.city),
            state: optionalString(draft.billingAddress.state),
            province: optionalString(draft.billingAddress.province),
            postalCode: optionalString(draft.billingAddress.postalCode),
            country: optionalString(draft.billingAddress.country),
            latitude: optionalNumber(draft.billingAddress.latitude),
            longitude: optionalNumber(draft.billingAddress.longitude),
        }),
        shippingAddress: compactObject({
            label: optionalString(draft.shippingAddress.label),
            line1: optionalString(draft.shippingAddress.line1),
            line2: optionalString(draft.shippingAddress.line2),
            city: optionalString(draft.shippingAddress.city),
            state: optionalString(draft.shippingAddress.state),
            province: optionalString(draft.shippingAddress.province),
            postalCode: optionalString(draft.shippingAddress.postalCode),
            country: optionalString(draft.shippingAddress.country),
            latitude: optionalNumber(draft.shippingAddress.latitude),
            longitude: optionalNumber(draft.shippingAddress.longitude),
        }),
        preferences: {
            marketingConsent: draft.preferences.marketingConsent,
            emailNotifications: draft.preferences.emailNotifications,
            smsNotifications: draft.preferences.smsNotifications,
        },
        tags: draft.tags.length ? draft.tags : undefined,
        segmentIds: draft.segmentIds.length ? draft.segmentIds : undefined,
    }
}

function canSubmitDraft(draft: CustomerCreateDraft) {
    return Boolean(trimString(draft.displayName) && draft.type && draft.lifecycleStage)
}

export function CustomerCreateProvider({children}: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const [draft, setDraft] = useState<CustomerCreateDraft>(INITIAL_DRAFT)
    const createCustomer = CustomerRequest.useCreateCustomer()

    const value = useMemo<CustomerCreateContextValue>(() => ({
        draft,
        isSubmitting: createCustomer.isPending,
        canSubmit: canSubmitDraft(draft),
        updateDraft: (patch) => setDraft((previous) => ({
            ...previous,
            ...patch,
        })),
        updatePersonalDetail: (patch) => setDraft((previous) => ({
            ...previous,
            personalDetail: {
                ...previous.personalDetail,
                ...patch,
            },
        })),
        updateBusinessDetail: (patch) => setDraft((previous) => ({
            ...previous,
            businessDetail: {
                ...previous.businessDetail,
                ...patch,
            },
        })),
        updateContact: (patch) => setDraft((previous) => ({
            ...previous,
            contact: {
                ...previous.contact,
                ...patch,
            },
        })),
        updateBillingAddress: (patch) => setDraft((previous) => ({
            ...previous,
            billingAddress: {
                ...previous.billingAddress,
                ...patch,
            },
        })),
        updateShippingAddress: (patch) => setDraft((previous) => ({
            ...previous,
            shippingAddress: {
                ...previous.shippingAddress,
                ...patch,
            },
        })),
        updatePreferences: (patch) => setDraft((previous) => ({
            ...previous,
            preferences: {
                ...previous.preferences,
                ...patch,
            },
        })),
        setTags: (tags) => setDraft((previous) => ({
            ...previous,
            tags,
        })),
        setSegmentIds: (segmentIds) => setDraft((previous) => ({
            ...previous,
            segmentIds,
        })),
        copyBillingToShipping: () => setDraft((previous) => ({
            ...previous,
            shippingAddress: {
                ...previous.billingAddress,
            },
        })),
        submitDraft: async () => {
            if (!canSubmitDraft(draft)) {
                toast.error("Display name, type, and lifecycle stage are required before submitting.")
                return
            }

            const created = await createCustomer.mutateAsync(buildRequestBody(draft))
            toast.success("Customer created.")
            setDraft(INITIAL_DRAFT)
            await navigate({
                to: "/admin/customers/$customerId/summary",
                params: {customerId: created.id},
            })
        },
        resetDraft: () => setDraft(INITIAL_DRAFT),
    }), [createCustomer, draft, navigate])

    return (
        <CustomerCreateContext.Provider value={value}>
            {children}
        </CustomerCreateContext.Provider>
    )
}

export function useCustomerCreate() {
    const context = useContext(CustomerCreateContext)
    if (!context) {
        throw new Error("useCustomerCreate must be used within CustomerCreateProvider")
    }

    return context
}
