import type {ReactNode} from "react"
import {Link, useNavigate} from "@tanstack/react-router"
import {ArrowLeft, ArrowRight, CheckCircle2, Sparkles} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {Progress} from "#/components/ui/progress.tsx"

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
    const stepIndex = REGISTRATION_STEPS.findIndex((entry) => entry.id === stepId)
    const progress = ((stepIndex + 1) / REGISTRATION_STEPS.length) * 100

    if (!step) return null

    return (
        <div
            className="grid min-h-full w-full overflow-hidden rounded-2xl border bg-background shadow-xl lg:grid-cols-[340px_1fr]">
            <aside className="relative overflow-hidden bg-foreground p-6 text-background">
                <img
                    src="/customer/portal-hero.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-24"
                />
                <div className="absolute inset-0 bg-foreground/90"/>
                <div className="relative z-10 grid h-full gap-8">
                    <div className="grid gap-4">
                        <div
                            className="flex size-11 items-center justify-center rounded-xl border border-background/15 bg-background/10">
                            <step.icon className="size-5 text-background"/>
                        </div>
                        <div>
                            <div className="text-lg font-semibold">Organization setup</div>
                            <p className="mt-2 text-sm leading-6 text-background/70">
                                Build the organization profile in short steps, then submit everything from the final
                                section.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div
                            className="flex items-center justify-between text-xs font-medium uppercase text-background/60">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress}
                                  className="bg-background/15 [&_[data-slot=progress-indicator]]:bg-background"/>
                    </div>
                    <div className={"flex flex-col gap-4 overflow-y-auto"}>
                        {REGISTRATION_STEPS.map((item, index) => {
                            const isActive = item.id === stepId
                            const isComplete = index < stepIndex
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors hover:bg-background/10 ${
                                        isActive ? "border-background/60 bg-background/10" : "border-background/10 bg-background/5"
                                    }`}
                                >
                                    <div
                                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                                            isActive ? "border-background bg-background text-foreground" : "border-background/20 text-background/70"
                                        }`}>
                                        {isComplete ? <CheckCircle2 className="size-4"/> : index + 1}
                                    </div>
                                    <span>
                                    <span className="block font-medium text-background">{item.label}</span>
                                    <span className="block leading-5 text-background/60">{item.description}</span>
                                </span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="mt-auto rounded-xl border border-background/15 bg-background/10 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Sparkles className="size-4 text-background"/>
                            Guided registration
                        </div>
                        <p className="mt-2 text-xs leading-5 text-background/70">
                            Required fields are checked as you move through core steps and again before final
                            submission.
                        </p>
                    </div>
                </div>
            </aside>

            <section className="grid min-h-180 grid-rows-[auto_1fr_auto]">
                <div className="border-b bg-muted/25 p-6 sm:p-8">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Step {stepIndex + 1} of {REGISTRATION_STEPS.length}</Badge>
                        <Badge variant="secondary">{step.shortLabel}</Badge>
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">{step.label}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>

                <div className=" overflow-y-auto space-y-6 p-6 sm:p-8">
                    {children}
                </div>

                <div
                    className="flex flex-col gap-3 border-t bg-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
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
                                Intro
                            </Link>
                        </Button>
                    )}

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
            </section>
        </div>
    )
}
