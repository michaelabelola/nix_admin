import type {ReactNode} from "react"
import {ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Sparkles} from "lucide-react"

import {Badge} from "@suiteonix/admin/src/components/ui/badge.tsx"
import {Button} from "@suiteonix/admin/src/components/ui/button.tsx"
import {Progress} from "@suiteonix/admin/src/components/ui/progress.tsx"

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
        <div className="grid min-h-full w-full overflow-hidden border rounded-2xl bg-background shadow-sm lg:grid-cols-[320px_1fr]">
            <aside className="relative overflow-hidden bg-foreground p-6 text-background">
                <img
                    src="/customer/portal-hero.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-28"
                />
                <div className="absolute inset-0 bg-foreground/90"/>
                <div className="relative z-10 grid h-full gap-8">
                    <div className="grid gap-4">
                        <div className="flex size-11 items-center justify-center border border-background/15 bg-background/10">
                            <LockKeyhole className="size-5 text-background"/>
                        </div>
                        <div>
                            <div className="text-lg font-semibold">Customer setup</div>
                            <p className="mt-2 text-sm leading-6 text-background/70">
                                Build the account in short steps, then confirm everything before submission.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div className="flex items-center justify-between text-xs font-medium uppercase text-background/60">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="bg-background/15 [&_[data-slot=progress-indicator]]:bg-background"/>
                    </div>

                    <div className="space-y-2">
                        {CUSTOMER_REGISTER_STEPS.map((item, index) => (
                            <StepNavItem
                                key={item.id}
                                stepId={item.id}
                                active={item.id === stepId}
                                complete={index < stepIndex}
                                number={index + 1}
                                onClick={goToStep}
                            />
                        ))}
                    </div>

                    <div className="mt-auto border border-background/15 bg-background/10 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Sparkles className="size-4 text-background"/>
                            Guided registration
                        </div>
                        <p className="mt-2 text-xs leading-5 text-background/70">
                            Required fields are kept to credentials and display name. Everything else can be refined later.
                        </p>
                    </div>
                </div>
            </aside>

            <section className="grid min-h-[720px] grid-rows-[auto_1fr_auto]">
                <div className="border-b bg-muted/20 p-5 sm:p-7">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Step {stepIndex + 1} of {totalSteps}</Badge>
                        <Badge variant="secondary">{step.label}</Badge>
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">{step.label}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>

                <div className="space-y-6 p-5 sm:p-7">
                    {children}
                </div>

                <div className="flex flex-col gap-3 border-t bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={goBack}
                    >
                        <ArrowLeft className="size-4"/>
                        {stepIndex === 0 ? "Intro" : "Back"}
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
            </section>
        </div>
    )
}

function StepNavItem({
    stepId,
    active,
    complete,
    number,
    onClick,
}: {
    stepId: CustomerRegisterStepID
    active: boolean
    complete: boolean
    number: number
    onClick: (stepId: CustomerRegisterStepID) => void
}) {
    const step = CUSTOMER_REGISTER_STEPS.find((item) => item.id === stepId)!

    return (
        <button
            type="button"
            className={`flex w-full items-start gap-3 border p-3 text-left text-sm transition-colors hover:bg-background/10 ${
                active ? "border-background/60 bg-background/10" : "border-background/10 bg-background/5"
            }`}
            onClick={() => onClick(stepId)}
        >
            <span className={`mt-0.5 flex size-7 items-center justify-center border text-xs font-semibold ${
                active ? "border-background bg-background text-foreground" : "border-background/20 text-background/70"
            }`}>
                {complete ? <CheckCircle2 className="size-4"/> : number}
            </span>
            <span>
                <span className="block font-medium text-background">{step.label}</span>
                <span className="block leading-5 text-background/60">{step.description}</span>
            </span>
        </button>
    )
}
