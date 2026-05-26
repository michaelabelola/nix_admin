import {CustomerModel} from "@suiteonix/server";

export type CustomerRegisterStepID = "intro" | "account" | "profile" | "avatar" | "addresses" | "preferences" | "review"

export type RegisterAddressDraft = {
    line1: string
    city: string
    state: string
    postalCode: string
    country: string
    latitude: string
    longitude: string
}

export type CustomerRegisterDraft = {
    displayName: string
    avatar: File | null
    email: string
    password: string
    confirmPassword: string
    language: string
    personalDetail: {
        firstName: string
        middleName: string
        lastName: string
        gender: string
        dateOfBirth: string
        nationality: string
        maritalStatus: string
        countryOfBirth: string
    }
    contact: {
        phoneNumber: string
    }
    billingAddress: RegisterAddressDraft
    sameAsBillingAddress: boolean
    shippingAddress: RegisterAddressDraft
    preferences: {
        marketingConsent: boolean
        emailNotifications: boolean
        smsNotifications: boolean
    }
}

export type CustomerRegisterContextValue = {
    draft: CustomerRegisterDraft
    stepId: CustomerRegisterStepID
    stepIndex: number
    totalSteps: number
    isSubmitting: boolean
    successEmail?: string
    canGoNext: boolean
    canSubmit: boolean
    updateDraft: (patch: Partial<CustomerRegisterDraft>) => void
    updatePersonalDetail: (patch: Partial<CustomerRegisterDraft["personalDetail"]>) => void
    updateContact: (patch: Partial<CustomerRegisterDraft["contact"]>) => void
    updateBillingAddress: (patch: Partial<RegisterAddressDraft>) => void
    updateShippingAddress: (patch: Partial<RegisterAddressDraft>) => void
    updatePreferences: (patch: Partial<CustomerRegisterDraft["preferences"]>) => void
    startRegistration: () => void
    goToStep: (stepId: CustomerRegisterStepID) => void
    goBack: () => void
    goNext: () => void
    submitDraft: () => Promise<void>
    closeSuccessDialog: () => void
    getFieldError: (field: string) => string | undefined
}

export type CustomerRegisterPayload = CustomerModel.SelfCreate
