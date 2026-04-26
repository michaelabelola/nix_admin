import type {ReactNode} from "react"
import {Link, useNavigate} from "@tanstack/react-router"
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

import {
    CUSTOMER_CREATE_INTRO_PATH,
    CUSTOMER_CREATE_STEPS,
    type CustomerCreateStepID,
    getCustomerCreateStep,
    getCustomerCreateStepIndex,
    getNextCustomerCreateStep,
    getPreviousCustomerCreateStep,
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
    const navigate = useNavigate()
    const step = getCustomerCreateStep(stepId)
    const previousStep = getPreviousCustomerCreateStep(stepId)
    const nextStep = getNextCustomerCreateStep(stepId)

    if (!step) return null

    return (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Creation Progress</CardTitle>
                    <CardDescription>
                        Move between steps freely. The backend request is sent only from the final review step.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Link
                        to={CUSTOMER_CREATE_INTRO_PATH}
                        className="flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/40"
                    >
                        <div className="mt-0.5 rounded-full border p-1 text-primary">
                            <CheckCircle2 className="size-3.5"/>
                        </div>
                        <div>
                            <div className="font-medium">Start</div>
                            <div className="text-muted-foreground">
                                Review the flow before entering customer details.
                            </div>
                        </div>
                    </Link>
                    {CUSTOMER_CREATE_STEPS.map((item, index) => {
                        const currentIndex = getCustomerCreateStepIndex(stepId)
                        const isActive = item.id === stepId
                        const isComplete = index < currentIndex

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/40 ${
                                    isActive ? "border-primary bg-primary/5" : ""
                                }`}
                            >
                                <div className={`mt-0.5 rounded-full border p-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                    {isComplete ? <CheckCircle2 className="size-3.5 text-success"/> : <item.icon className="size-3.5"/>}
                                </div>
                                <div>
                                    <div className="font-medium">{item.label}</div>
                                    <div className="text-muted-foreground">{item.description}</div>
                                </div>
                            </Link>
                        )
                    })}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">
                                Step {getCustomerCreateStepIndex(stepId) + 1} of {CUSTOMER_CREATE_STEPS.length}
                            </Badge>
                            <Badge variant="secondary">{step.shortLabel}</Badge>
                        </div>
                        <CardTitle>{step.label}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {children}

                    <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <Button variant="outline" asChild>
                            <Link to={(previousStep?.path ?? CUSTOMER_CREATE_INTRO_PATH) as any}>
                                <ArrowLeft className="size-4"/>
                                Back
                            </Link>
                        </Button>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button variant="ghost" asChild disabled={isBusy}>
                                <Link to="/admin/customers">Cancel</Link>
                            </Button>

                            {onNext ? (
                                <Button type="button" disabled={disableNext || isBusy} onClick={() => void onNext()}>
                                    {nextLabel}
                                    <ArrowRight className="size-4"/>
                                </Button>
                            ) : nextStep ? (
                                <Button
                                    type="button"
                                    disabled={disableNext || isBusy}
                                    onClick={() => void navigate({to: nextStep.path as any})}
                                >
                                    {nextLabel}
                                    <ArrowRight className="size-4"/>
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
