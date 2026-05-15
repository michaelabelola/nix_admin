import type {CustomerModel} from "#/modules/customer/model.ts"

export type CustomerRegisterStepID = "intro" | "account" | "profile" | "contact" | "addresses" | "preferences" | "review"

export type RegisterAddressDraft = {
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

export type CustomerRegisterDraft = {
    displayName: string
    email: string
    password: string
    confirmPassword: string
    language: string
    personalDetail: {
        firstName: string
        middleName: string
        lastName: string
        title: string
        gender: string
        dateOfBirth: string
        nationality: string
        countryOfBirth: string
        profession: string
    }
    contact: {
        secondaryEmail: string
        phoneNumber: string
        mobileNumber: string
        website: string
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
