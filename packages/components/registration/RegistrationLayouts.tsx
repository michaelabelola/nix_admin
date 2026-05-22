import type {ElementType, ReactNode} from "react"
import {Link, useNavigate} from "@tanstack/react-router"
import {ArrowLeft, ArrowRight, CheckCircle2, Sparkles} from "lucide-react"

import {Badge, Button, Progress} from "@suiteonix/ui"
import {Page} from "@suiteonix/components";

export type RegistrationFlowStep<TStepID extends string = string> = {
    id: TStepID
    label: string
    shortLabel: string
    path: string
    icon: ElementType
    description: string
}

type RegistrationIntroHighlight = {
    icon: ElementType
    title: string
    description: string
}

type RegistrationAction = {
    label: string
    to: string
}

type RegistrationCallout = {
    icon?: ElementType
    title: string
    description: string
}

export function RegistrationPageShell({children}: { children: ReactNode }) {
    return (
        <Page clearPadding fixed className="h-full">
            <div
                className="mx-auto flex h-full items-center justify-center max-w-7xl flex-col px-4 py-6">
                {children}
            </div>
        </Page>
    )
}

export function RegistrationIntroLayout({
                                            heroImageSrc = "/customer/portal-hero.png",
                                            heroImageAlt,
                                            badges,
                                            title,
                                            description,
                                            primaryAction,
                                            secondaryAction,
                                            highlights,
                                            beforeEyebrow = "Before you start",
                                            beforeTitle,
                                            beforeDescription,
                                            checklist,
                                            callout,
                                        }: {
    heroImageSrc?: string
    heroImageAlt: string
    badges: string[]
    title: string
    description: string
    primaryAction: RegistrationAction
    secondaryAction?: RegistrationAction
    highlights: RegistrationIntroHighlight[]
    beforeEyebrow?: string
    beforeTitle: string
    beforeDescription: string
    checklist: string[]
    callout: RegistrationCallout
}) {
    const CalloutIcon = callout.icon ?? CheckCircle2
    // TODO: change class of section from rounded
    return (
        <section
            className="grid min-h-full w-full overflow-hidden rounded border bg-background shadow-xl lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative min-h-140 overflow-hidden bg-foreground p-8 text-background sm:p-10">
                <img
                    src={heroImageSrc}
                    alt={heroImageAlt}
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-foreground/85"/>
                <div className="relative z-10 grid h-full content-between gap-8">
                    <div className="flex flex-wrap gap-2">
                        {badges.map((badge) => (
                            <Badge key={badge}
                                   className="border-background/20 bg-background/10 text-background hover:bg-background/10">
                                {badge}
                            </Badge>
                        ))}
                    </div>

                    <div className="grid max-w-xl gap-6">
                        <div
                            className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/10">
                            <Sparkles className="size-6 text-background"/>
                        </div>
                        <div className="grid gap-4">
                            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                                {title}
                            </h1>
                            <p className="max-w-lg text-base leading-8 text-background/80">
                                {description}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                                <Link to={primaryAction.to as any}>
                                    {primaryAction.label}
                                    <ArrowRight className="size-4"/>
                                </Link>
                            </Button>
                            {secondaryAction ? (
                                <Button asChild size="lg" variant="inverted_glass"
                                        className="border-background/30 bg-background/10 text-background hover:bg-background/20 hover:text-background">
                                    <Link to={secondaryAction.to as any}>{secondaryAction.label}</Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {highlights.map((item) => (
                            <div key={item.title}
                                 className="rounded-xl border border-background/15 bg-background/10 p-4 backdrop-blur">
                                <item.icon className="mb-3 size-5 text-background"/>
                                <div className="text-sm font-semibold">{item.title}</div>
                                <div className="mt-1 text-xs leading-5 text-background/70">{item.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid content-center gap-8 p-8 sm:p-10">
                <div className="grid gap-3">
                    <Badge variant="outline" className="w-fit">{beforeEyebrow}</Badge>
                    <h2 className="text-3xl font-semibold tracking-tight">{beforeTitle}</h2>
                    <p className="text-muted-foreground">{beforeDescription}</p>
                </div>

                <div className="grid gap-3">
                    {checklist.map((item) => (
                        <IntroChecklistItem key={item} label={item}/>
                    ))}
                </div>

                <div className="rounded-xl border bg-muted/40 p-5">
                    <div className="flex items-start gap-3">
                        <CalloutIcon className="mt-0.5 size-5 text-primary"/>
                        <div>
                            <div className="font-medium">{callout.title}</div>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{callout.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function RegistrationStepLayout<TStepID extends string>({
                                                                   steps,
                                                                   stepId,
                                                                   introPath,
                                                                   children,
                                                                   sidebarTitle,
                                                                   sidebarDescription,
                                                                   sidebarFooterTitle = "Guided registration",
                                                                   sidebarFooterDescription,
                                                                   heroImageSrc = "/customer/portal-hero.png",
                                                                   nextLabel = "Continue",
                                                                   disableNext = false,
                                                                   isBusy = false,
                                                                   onNext,
                                                                   cancelTo,
                                                                   cancelLabel = "Cancel",
                                                               }: {
    steps: RegistrationFlowStep<TStepID>[]
    stepId: TStepID
    introPath: string
    children: ReactNode
    sidebarTitle: string
    sidebarDescription: string
    sidebarFooterTitle?: string
    sidebarFooterDescription: string
    heroImageSrc?: string
    nextLabel?: string
    disableNext?: boolean
    isBusy?: boolean
    onNext?: () => void | Promise<void>
    cancelTo?: string
    cancelLabel?: string
}) {
    const navigate = useNavigate()
    const stepIndex = steps.findIndex((entry) => entry.id === stepId)
    const step = steps[stepIndex]
    const previousStep = stepIndex > 0 ? steps[stepIndex - 1] : undefined
    const nextStep = stepIndex >= 0 && stepIndex < steps.length - 1 ? steps[stepIndex + 1] : undefined
    const progress = stepIndex >= 0 ? ((stepIndex + 1) / steps.length) * 100 : 0

    if (!step) return null

    return (
        <div
            className="min-h-full w-full overflow-hidden rounded-2xl border bg-background  shadow-xl flex flex-col-reverse lg:grid lg:grid-cols-[340px_1fr]">
            <aside className="relative overflow-hidden bg-foreground p-6 text-background overflow-y-auto">
                <img
                    src={heroImageSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-24"
                />
                <div className="absolute inset-0 bg-foreground/90"/>
                <div className="relative z-10 grid h-fit gap-8">
                    <div className="grid gap-4">
                        <div
                            className="flex size-11 items-center justify-center rounded-xl border border-background/15 bg-background/10">
                            <step.icon className="size-5 text-background"/>
                        </div>
                        <div>
                            <div className="text-lg font-semibold">{sidebarTitle}</div>
                            <p className="mt-2 text-sm leading-6 text-background/70">{sidebarDescription}</p>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div
                            className="flex items-center justify-between text-xs font-medium uppercase text-background/60">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress}
                                  className="bg-background/15 **:data-[slot=progress-indicator]:bg-background"/>
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-auto">
                        {steps.map((item, index) => {
                            const isActive = item.id === stepId
                            const isComplete = index < stepIndex

                            return (
                                <Link
                                    key={item.id}
                                    to={item.path as any}
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
                            {sidebarFooterTitle}
                        </div>
                        <p className="mt-2 text-xs leading-5 text-background/70">{sidebarFooterDescription}</p>
                    </div>
                </div>
            </aside>

            <section className="grid min-h-180 grid-rows-[auto_1fr_auto]">
                <div className="border-b bg-muted/25 p-6 sm:p-8">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Step {stepIndex + 1} of {steps.length}</Badge>
                        <Badge variant="secondary">{step.shortLabel}</Badge>
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">{step.label}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>

                <div className="space-y-6 overflow-y-auto p-6 sm:p-8">
                    {children}
                </div>

                <div
                    className="flex flex-col gap-3 border-t bg-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <Button variant="outline" asChild disabled={isBusy}>
                        <Link to={(previousStep?.path ?? introPath) as any}>
                            <ArrowLeft className="size-4"/>
                            {previousStep ? "Back" : "Intro"}
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {cancelTo ? (
                            <Button variant="ghost" asChild disabled={isBusy}>
                                <Link to={cancelTo as any}>{cancelLabel}</Link>
                            </Button>
                        ) : null}

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
            </section>
        </div>
    )
}

function IntroChecklistItem({label}: { label: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
            <CheckCircle2 className="size-5 text-primary"/>
            <span className="text-sm font-medium">{label}</span>
        </div>
    )
}
