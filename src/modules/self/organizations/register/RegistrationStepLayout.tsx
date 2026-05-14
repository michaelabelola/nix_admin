import type {ReactNode} from "react"

import {RegistrationStepLayout as SharedRegistrationStepLayout} from "#/components/registration/RegistrationLayouts.tsx"

import {
    REGISTRATION_INTRO_PATH,
    REGISTRATION_STEPS,
} from "./constants.ts"

export function RegistrationStepLayout({
    stepId,
    children,
    nextLabel = "Continue",
    disableNext = false,
    isBusy = false,
    onNext,
}: {
    stepId: string
    children: ReactNode
    nextLabel?: string
    disableNext?: boolean
    isBusy?: boolean
    onNext?: () => void | Promise<void>
}) {
    return (
        <SharedRegistrationStepLayout
            steps={REGISTRATION_STEPS}
            stepId={stepId}
            introPath={REGISTRATION_INTRO_PATH}
            sidebarTitle="Organization setup"
            sidebarDescription="Build the organization profile in short steps, then submit everything from the final section."
            sidebarFooterDescription="Required fields are checked as you move through core steps and again before final submission."
            nextLabel={nextLabel}
            disableNext={disableNext}
            isBusy={isBusy}
            onNext={onNext}
        >
            {children}
        </SharedRegistrationStepLayout>
    )
}
