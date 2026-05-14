import type {ReactNode} from "react"

import {RegistrationStepLayout} from "#/components/registration/RegistrationLayouts.tsx"

import {
    CUSTOMER_CREATE_INTRO_PATH,
    CUSTOMER_CREATE_STEPS,
    type CustomerCreateStepID,
} from "./customer-create.constants.ts"

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
    return (
        <RegistrationStepLayout
            steps={CUSTOMER_CREATE_STEPS}
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
