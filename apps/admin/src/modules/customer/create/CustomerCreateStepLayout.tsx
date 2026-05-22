import {useEffect} from "react"
import type {ReactNode} from "react"
import {useNavigate} from "@tanstack/react-router"


import {
    CUSTOMER_CREATE_INTRO_PATH,
    type CustomerCreateStepID,
    getCustomerCreateStepsForType,
} from "./customer-create.constants.ts"
import {useCustomerCreate} from "./customer-create.context.tsx"
import { RegistrationStepLayout } from "@suiteonix/components"

export function CustomerCreateStepLayout({
    stepId,
    children,
    nextLabel = "Continue",
    disableNext = false,
    isBusy = false,
    onNext,
}: {
    stepId: CustomerCreateStepID
    children: ReactNode
    nextLabel?: string
    disableNext?: boolean
    isBusy?: boolean
    onNext?: () => void | Promise<void>
}) {
    const navigate = useNavigate()
    const {draft} = useCustomerCreate()
    const steps = getCustomerCreateStepsForType(draft.type)
    const isVisibleStep = steps.some((step) => step.id === stepId)

    useEffect(() => {
        if (isVisibleStep) return

        const fallbackStep = steps.find((step) => step.id === "business") ?? steps.find((step) => step.id === "personal") ?? steps[0]
        if (fallbackStep) {
            void navigate({to: fallbackStep.path as any, replace: true})
        }
    }, [isVisibleStep, navigate, steps])

    if (!isVisibleStep) return null

    return (
        <RegistrationStepLayout
            steps={steps}
            stepId={stepId}
            introPath={CUSTOMER_CREATE_INTRO_PATH}
            sidebarTitle="Customer setup"
            sidebarDescription="Create the customer in short route-based steps, then submit the complete draft from review."
            sidebarFooterTitle="Guided creation"
            sidebarFooterDescription="Only the basics are required, and optional sections can be refined before the final backend request."
            cancelTo="/admin/customers"
            nextLabel={nextLabel}
            disableNext={disableNext}
            isBusy={isBusy}
            onNext={onNext}
        >
            {children}
        </RegistrationStepLayout>
    )
}
