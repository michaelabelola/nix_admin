import React, {createContext, useContext, useMemo, useState} from "react"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"

import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx"
import customerApi from "#/modules/customer/api.ts"
import {CustomerQueryKeys} from "#/modules/customer/query-keys.ts"

import type {
    CustomerRegisterContextValue,
    CustomerRegisterDraft,
    CustomerRegisterStepID,
    RegisterAddressDraft,
} from "./customer-register.types.ts"
import {
    CUSTOMER_REGISTER_STEPS,
    INITIAL_CUSTOMER_REGISTER_DRAFT,
    buildCustomerSelfAccountPayload,
    canLeaveStep,
    canSubmitRegistration,
    getStepByIndex,
    getStepIndex,
} from "./customer-register.utils.ts"

const CustomerRegisterContext = createContext<CustomerRegisterContextValue | null>(null)

export function CustomerRegisterProvider({children}: { children: React.ReactNode }) {
    const queryClient = useQueryClient()
    const errHandler = useResponseFieldErrorHandler()
    const [draft, setDraft] = useState<CustomerRegisterDraft>(INITIAL_CUSTOMER_REGISTER_DRAFT)
    const [stepId, setStepId] = useState<CustomerRegisterStepID>("intro")
    const [successEmail, setSuccessEmail] = useState<string>()

    const createAccount = useMutation({
        mutationFn: (body: CustomerRegisterDraft) =>
            customerApi.createSelfAccount(buildCustomerSelfAccountPayload(body), {errHandler}),
        onSuccess: async (_data, submittedDraft) => {
            await queryClient.invalidateQueries({queryKey: CustomerQueryKeys.root})
            setSuccessEmail(submittedDraft.email.trim())
            setDraft(INITIAL_CUSTOMER_REGISTER_DRAFT)
            setStepId("intro")
        },
    })

    const stepIndex = getStepIndex(stepId)
    const canSubmit = canSubmitRegistration(draft)
    const canGoNext = canLeaveStep(stepId, draft)

    const value = useMemo<CustomerRegisterContextValue>(() => ({
        draft,
        stepId,
        stepIndex,
        totalSteps: CUSTOMER_REGISTER_STEPS.length,
        isSubmitting: createAccount.isPending,
        successEmail,
        canGoNext,
        canSubmit,
        updateDraft: (patch) => setDraft((previous) => ({...previous, ...patch})),
        updatePersonalDetail: (patch) => setDraft((previous) => ({
            ...previous,
            personalDetail: {...previous.personalDetail, ...patch},
        })),
        updateContact: (patch) => setDraft((previous) => ({
            ...previous,
            contact: {...previous.contact, ...patch},
        })),
        updateBillingAddress: (patch: Partial<RegisterAddressDraft>) => setDraft((previous) => ({
            ...previous,
            billingAddress: {...previous.billingAddress, ...patch},
        })),
        updateShippingAddress: (patch: Partial<RegisterAddressDraft>) => setDraft((previous) => ({
            ...previous,
            shippingAddress: {...previous.shippingAddress, ...patch},
        })),
        updatePreferences: (patch) => setDraft((previous) => ({
            ...previous,
            preferences: {...previous.preferences, ...patch},
        })),
        startRegistration: () => setStepId("account"),
        goToStep: (nextStepId) => setStepId(nextStepId),
        goBack: () => setStepId(stepIndex === 0 ? "intro" : getStepByIndex(stepIndex - 1).id),
        goNext: () => {
            if (!canLeaveStep(stepId, draft)) {
                toast.error("Complete the required account fields before continuing.")
                return
            }
            setStepId(getStepByIndex(stepIndex + 1).id)
        },
        submitDraft: async () => {
            if (!canSubmitRegistration(draft)) {
                toast.error("Display name, email, and matching password are required.")
                return
            }
            await createAccount.mutateAsync(draft)
        },
        closeSuccessDialog: () => setSuccessEmail(undefined),
        getFieldError: errHandler.getErrorMessage,
    }), [canGoNext, canSubmit, createAccount, draft, errHandler.getErrorMessage, stepId, stepIndex, successEmail])

    return (
        <CustomerRegisterContext.Provider value={value}>
            {children}
        </CustomerRegisterContext.Provider>
    )
}

export function useCustomerRegister() {
    const context = useContext(CustomerRegisterContext)
    if (!context) {
        throw new Error("useCustomerRegister must be used within CustomerRegisterProvider")
    }
    return context
}
