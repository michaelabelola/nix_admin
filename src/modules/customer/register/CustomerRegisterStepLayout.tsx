import type {ReactNode} from "react"
import {ArrowLeft, ArrowRight, CheckCircle2} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card.tsx"
import {Progress} from "#/components/ui/progress.tsx"

import {useCustomerRegister} from "./customer-register.context.tsx"
import type {CustomerRegisterStepID} from "./customer-register.types.ts"
import {CUSTOMER_REGISTER_STEPS} from "./customer-register.utils.ts"

export function CustomerRegisterStepLayout({
    children,
    nextLabel = "Continue",
}: {
    children: ReactNode
    nextLabel?: string
}) {
    const {
        stepId,
        stepIndex,
        totalSteps,
        isSubmitting,
        canGoNext,
        goBack,
        goNext,
        goToStep,
        submitDraft,
    } = useCustomerRegister()
    const step = CUSTOMER_REGISTER_STEPS[stepIndex]
    const isReview = stepId === "review"
    const progress = ((stepIndex + 1) / totalSteps) * 100

    return (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Registration Progress</CardTitle>
                    <CardDescription>
                        Complete the account details, then review the request before creating the customer account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Progress value={progress}/>
                    <div className="space-y-2">
                        {CUSTOMER_REGISTER_STEPS.map((item, index) => (
                            <StepNavItem
                                key={item.id}
                                stepId={item.id}
                                active={item.id === stepId}
                                complete={index < stepIndex}
                                onClick={goToStep}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Step {stepIndex + 1} of {totalSteps}</Badge>
                        <Badge variant="secondary">{step.label}</Badge>
                    </div>
                    <CardTitle>{step.label}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {children}

                    <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={stepIndex === 0 || isSubmitting}
                            onClick={goBack}
                        >
                            <ArrowLeft className="size-4"/>
                            Back
                        </Button>

                        <Button
                            type="button"
                            disabled={isSubmitting || (!isReview && !canGoNext)}
                            onClick={isReview ? () => void submitDraft() : goNext}
                        >
                            {isReview ? "Create account" : nextLabel}
                            <ArrowRight className="size-4"/>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function StepNavItem({
    stepId,
    active,
    complete,
    onClick,
}: {
    stepId: CustomerRegisterStepID
    active: boolean
    complete: boolean
    onClick: (stepId: CustomerRegisterStepID) => void
}) {
    const step = CUSTOMER_REGISTER_STEPS.find((item) => item.id === stepId)!

    return (
        <button
            type="button"
            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted/40 ${
                active ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onClick(stepId)}
        >
            <span className={`mt-0.5 rounded-full border p-1 ${active ? "text-primary" : "text-muted-foreground"}`}>
                {complete ? <CheckCircle2 className="size-3.5 text-success"/> : <span className="block size-3.5 rounded-full bg-current opacity-40"/>}
            </span>
            <span>
                <span className="block font-medium">{step.label}</span>
                <span className="block text-muted-foreground">{step.description}</span>
            </span>
        </button>
    )
}
