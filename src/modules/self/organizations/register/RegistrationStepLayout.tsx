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
    getNextRegistrationStep,
    getPreviousRegistrationStep,
    getRegistrationStep,
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
    const navigate = useNavigate()
    const step = getRegistrationStep(stepId)
    const previousStep = getPreviousRegistrationStep(stepId)
    const nextStep = getNextRegistrationStep(stepId)

    if (!step) return null

    return (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Registration Progress</CardTitle>
                    <CardDescription>
                        Complete each section to prepare your organization registration.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Link
                        to={REGISTRATION_INTRO_PATH}
                        className="flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/40"
                    >
                        <div className="mt-0.5 rounded-full border p-1 text-primary">
                            <CheckCircle2 className="size-3.5"/>
                        </div>
                        <div>
                            <div className="font-medium">Start</div>
                            <div className="text-muted-foreground">
                                Introduction and preparation details.
                            </div>
                        </div>
                    </Link>
                    {REGISTRATION_STEPS.map((item, index) => {
                        const isActive = item.id === stepId
                        const isComplete = index < REGISTRATION_STEPS.findIndex((entry) => entry.id === stepId)
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/40 ${
                                    isActive ? "border-primary bg-primary/5" : ""
                                }`}
                            >
                                <div className={`mt-0.5 rounded-full border p-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                    {isComplete ? <CheckCircle2 className="size-3.5"/> : <item.icon className="size-3.5"/>}
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
                    <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                    Step {REGISTRATION_STEPS.findIndex((entry) => entry.id === stepId) + 1} of {REGISTRATION_STEPS.length}
                                </Badge>
                                <Badge variant="secondary">{step.shortLabel}</Badge>
                            </div>
                            <CardTitle>{step.label}</CardTitle>
                            <CardDescription>{step.description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {children}

                    <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            {previousStep ? (
                                <Button variant="outline" asChild>
                                    <Link to={previousStep.path}>
                                        <ArrowLeft className="size-4"/>
                                        Back
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="outline" asChild>
                                    <Link to={REGISTRATION_INTRO_PATH}>
                                        <ArrowLeft className="size-4"/>
                                        Back
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {onNext ? (
                            <Button
                                type="button"
                                onClick={() => void onNext()}
                                disabled={disableNext || isBusy}
                            >
                                {nextLabel}
                                <ArrowRight className="size-4"/>
                            </Button>
                        ) : nextStep ? (
                            <Button
                                type="button"
                                disabled={disableNext}
                                onClick={() => void navigate({to: nextStep.path as any})}
                            >
                                {nextLabel}
                                <ArrowRight className="size-4"/>
                            </Button>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
