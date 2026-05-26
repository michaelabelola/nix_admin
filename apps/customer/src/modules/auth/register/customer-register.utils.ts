import type {
    CustomerRegisterDraft,
    CustomerRegisterPayload,
    CustomerRegisterStepID,
    RegisterAddressDraft,
} from "./customer-register.types.ts"

export type CustomerRegisterFormStepID = Exclude<CustomerRegisterStepID, "intro">

const EMPTY_ADDRESS: RegisterAddressDraft = {
    line1: "",
    city: "",
    state: "",
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
        id: "avatar",
        label: "Avatar",
        description: "Optional profile image.",
    },
    {
        id: "addresses",
        label: "Billing Address",
        description: "Billing address details.",
    },
    {
        id: "shipping-address",
        label: "Shipping Address",
        description: "Shipping address details.",
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
    avatar: null,
    email: "",
    password: "",
    confirmPassword: "",
    language: "en",
    personalDetail: {
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        countryOfBirth: "",
    },
    contact: {
        phoneNumber: "",
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
        line1: optionalString(address.line1),
        city: optionalString(address.city),
        state: optionalString(address.state),
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
            gender: optionalString(draft.personalDetail.gender),
            dateOfBirth: optionalString(draft.personalDetail.dateOfBirth),
            countryOfBirth: optionalString(draft.personalDetail.countryOfBirth),
        }),
        contact: compactObject({
            phoneNumber: optionalString(draft.contact.phoneNumber),
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
