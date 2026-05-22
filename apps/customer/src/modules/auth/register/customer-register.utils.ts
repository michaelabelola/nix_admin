import type {
    CustomerRegisterDraft,
    CustomerRegisterPayload,
    CustomerRegisterStepID,
    RegisterAddressDraft,
} from "./customer-register.types.ts"

export type CustomerRegisterFormStepID = Exclude<CustomerRegisterStepID, "intro">

const EMPTY_ADDRESS: RegisterAddressDraft = {
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

export const CUSTOMER_REGISTER_STEPS: Array<{
    id: CustomerRegisterFormStepID
    label: string
    description: string
}> = [
    {
        id: "account",
        label: "Account",
        description: "Email and password credentials.",
    },
    {
        id: "profile",
        label: "Profile",
        description: "Personal identity details.",
    },
    {
        id: "contact",
        label: "Contact",
        description: "Optional secondary channels.",
    },
    {
        id: "addresses",
        label: "Addresses",
        description: "Billing and shipping details.",
    },
    {
        id: "preferences",
        label: "Preferences",
        description: "Communication consent settings.",
    },
    {
        id: "review",
        label: "Review",
        description: "Confirm and create the account.",
    },
]

export const INITIAL_CUSTOMER_REGISTER_DRAFT: CustomerRegisterDraft = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    language: "en",
    personalDetail: {
        firstName: "",
        middleName: "",
        lastName: "",
        title: "",
        gender: "",
        dateOfBirth: "",
        nationality: "",
        countryOfBirth: "",
        profession: "",
    },
    contact: {
        secondaryEmail: "",
        phoneNumber: "",
        mobileNumber: "",
        website: "",
    },
    billingAddress: {...EMPTY_ADDRESS},
    sameAsBillingAddress: true,
    shippingAddress: {...EMPTY_ADDRESS},
    preferences: {
        marketingConsent: false,
        emailNotifications: true,
        smsNotifications: false,
    },
}

export function getStepIndex(stepId: CustomerRegisterStepID) {
    if (stepId === "intro") return 0
    return Math.max(0, CUSTOMER_REGISTER_STEPS.findIndex((step) => step.id === stepId))
}

export function getStepByIndex(index: number) {
    return CUSTOMER_REGISTER_STEPS[Math.min(Math.max(index, 0), CUSTOMER_REGISTER_STEPS.length - 1)]
}

export function optionalString(value?: string | null) {
    const normalized = value?.trim() ?? ""
    return normalized ? normalized : undefined
}

function optionalNumber(value?: string | null) {
    const normalized = optionalString(value)
    if (!normalized) return undefined

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : undefined
}

function compactObject<T extends Record<string, unknown>>(value: T) {
    const hasValue = Object.values(value).some((entry) => entry !== undefined && entry !== null && entry !== "")
    return hasValue ? value : undefined
}

function buildAddress(address: RegisterAddressDraft) {
    return compactObject({
        label: optionalString(address.label),
        line1: optionalString(address.line1),
        line2: optionalString(address.line2),
        city: optionalString(address.city),
        state: optionalString(address.state),
        province: optionalString(address.province),
        postalCode: optionalString(address.postalCode),
        country: optionalString(address.country),
        latitude: optionalNumber(address.latitude),
        longitude: optionalNumber(address.longitude),
    })
}

export function isPasswordConfirmed(draft: CustomerRegisterDraft) {
    return Boolean(draft.password && draft.password === draft.confirmPassword)
}

export function canSubmitRegistration(draft: CustomerRegisterDraft) {
    return Boolean(optionalString(draft.email) && isPasswordConfirmed(draft))
}

export function canLeaveStep(stepId: CustomerRegisterStepID, draft: CustomerRegisterDraft) {
    if (stepId === "intro") return true
    if (stepId === "account") return canSubmitRegistration(draft)
    return true
}

export function buildCustomerSelfAccountPayload(draft: CustomerRegisterDraft): CustomerRegisterPayload {
    return {
        displayName: optionalString(draft.displayName),
        email: draft.email.trim(),
        password: draft.password,
        language: optionalString(draft.language),
        personalDetail: compactObject({
            firstName: optionalString(draft.personalDetail.firstName),
            middleName: optionalString(draft.personalDetail.middleName),
            lastName: optionalString(draft.personalDetail.lastName),
            title: optionalString(draft.personalDetail.title),
            gender: optionalString(draft.personalDetail.gender),
            dateOfBirth: optionalString(draft.personalDetail.dateOfBirth),
            nationality: optionalString(draft.personalDetail.nationality),
            countryOfBirth: optionalString(draft.personalDetail.countryOfBirth),
            profession: optionalString(draft.personalDetail.profession),
        }),
        contact: compactObject({
            secondaryEmail: optionalString(draft.contact.secondaryEmail),
            phoneNumber: optionalString(draft.contact.phoneNumber),
            mobileNumber: optionalString(draft.contact.mobileNumber),
            website: optionalString(draft.contact.website),
        }),
        billingAddress: buildAddress(draft.billingAddress),
        sameAsBillingAddress: draft.sameAsBillingAddress,
        shippingAddress: draft.sameAsBillingAddress ? undefined : buildAddress(draft.shippingAddress),
        preferences: {
            marketingConsent: draft.preferences.marketingConsent,
            emailNotifications: draft.preferences.emailNotifications,
            smsNotifications: draft.preferences.smsNotifications,
        },
    }
}
