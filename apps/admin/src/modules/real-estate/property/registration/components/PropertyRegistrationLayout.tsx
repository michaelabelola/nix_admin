import type {ReactNode} from "react"
import {Link} from "@tanstack/react-router"
import {ArrowLeft, ArrowRight, CheckCircle2, Sparkles} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {Progress} from "#/components/ui/progress.tsx"
import type {PropertyModel} from "@suiteonix/server"

import {
    type PropertyRegistrationStepID,
    getNextPropertyRegistrationStep,
    getPreviousPropertyRegistrationStep,
    getPropertyRegistrationStep,
    getPropertyRegistrationSteps,
} from "./property-registration.constants.ts"
import Page from "#/components/Page.tsx";

export function PropertyRegistrationLayout({
                                               stepId,
                                               propertyId,
                                               property,
                                               children,
                                               skipHref,
                                               nextHref,
                                               nextLabel = "Continue",
                                               disableNext = false,
                                               isBusy = false,
                                               onNext,
                                           }: {
    stepId: PropertyRegistrationStepID
    propertyId?: string
    property?: Pick<
        PropertyModel.Detailed,
        "id" | "name" | "type" | "lifecycleStage" | "storageID" | "tags"
    >
    children: ReactNode
    skipHref?: string
    nextHref?: string
    nextLabel?: string
    disableNext?: boolean
    isBusy?: boolean
    onNext?: () => void | Promise<void>
}) {
    const step = getPropertyRegistrationStep(stepId, propertyId)
    const steps = getPropertyRegistrationSteps(propertyId)
    const stepIndex = steps.findIndex((entry) => entry.id === stepId)
    const previousStep = getPreviousPropertyRegistrationStep(stepId, propertyId)
    const nextStep = getNextPropertyRegistrationStep(stepId, propertyId)
    const progress = stepIndex >= 0 ? ((stepIndex + 1) / steps.length) * 100 : 0

    if (!step) return null

    const resolvedBackHref =
        previousStep?.path ?? "/admin/real-estate/properties"
    const resolvedNextHref = nextHref ?? nextStep?.path
    const skipLabel = stepId === "create" ? "Cancel" : "Skip"

    return (
        <Page>
            <div
                className="min-h-full w-full overflow-hidden rounded-2xl border bg-background shadow-xl flex flex-col-reverse lg:grid lg:grid-cols-[340px_1fr]">
                <aside className="relative overflow-hidden bg-foreground p-6 text-background">
                    <div className="absolute inset-0 bg-foreground/95"/>
                    <div className="relative z-10 grid h-fit gap-8">
                        <div className="grid gap-4">
                            <div
                                className="flex size-11 items-center justify-center rounded-xl border border-background/15 bg-background/10">
                                <step.icon className="size-5 text-background"/>
                            </div>
                            <div>
                                <div className="text-lg font-semibold">Property setup</div>
                                <p className="mt-2 text-sm leading-6 text-background/70">
                                    Create the property, add presentation details, attach storage, set location, and
                                    finish onboarding in a route-backed flow.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-background/15 bg-background/10 p-4">
                            <div className="text-sm font-medium">
                                {property?.name?.trim() || "New property"}
                            </div>
                            <div className="mt-1 break-all text-xs leading-5 text-background/60">
                                {property?.id ?? "Property id will be assigned after creation."}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {property?.type ? <Badge
                                    className="bg-background/15 text-background hover:bg-background/20">{property.type}</Badge> : null}
                                {property?.lifecycleStage ? (
                                    <Badge
                                        className="bg-background/15 text-background hover:bg-background/20">{property.lifecycleStage}</Badge>
                                ) : null}
                                {property?.storageID ? (
                                    <Badge className="bg-background/15 text-background hover:bg-background/20">Storage
                                        active</Badge>
                                ) : null}
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
                                const content = (
                                    <>
                                        <div
                                            className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                                                isActive ? "border-background bg-background text-foreground" : "border-background/20 text-background/70"
                                            }`}
                                        >
                                            {isComplete ? <CheckCircle2 className="size-4"/> : index + 1}
                                        </div>
                                        <span>
                    <span className="block font-medium text-background">{item.label}</span>
                    <span className="block leading-5 text-background/60">{item.description}</span>
                  </span>
                                    </>
                                )
                                const className = `flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${
                                    isActive ? "border-background/60 bg-background/10" : "border-background/10 bg-background/5"
                                } ${item.path ? "hover:bg-background/10" : "cursor-not-allowed opacity-55"}`

                                if (!item.path) {
                                    return <div key={item.id} className={className}>{content}</div>
                                }

                                return (
                                    <Link key={item.id} to={item.path as any} className={className}>
                                        {content}
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="mt-auto rounded-xl border border-background/15 bg-background/10 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Sparkles className="size-4 text-background"/>
                                Guided onboarding
                            </div>
                            <p className="mt-2 text-xs leading-5 text-background/70">
                                Required setup happens first; optional media, storage, and tags can be skipped and
                                refined later.
                            </p>
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
                            <Link to={resolvedBackHref as any}>
                                <ArrowLeft className="size-4"/>
                                Back
                            </Link>
                        </Button>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            {skipHref ? (
                                <Button variant="ghost" asChild disabled={isBusy}>
                                    <Link to={skipHref as any}>{skipLabel}</Link>
                                </Button>
                            ) : null}

                            {onNext ? (
                                <Button type="button" disabled={disableNext || isBusy} onClick={() => void onNext()}>
                                    {nextLabel}
                                    <ArrowRight className="size-4"/>
                                </Button>
                            ) : resolvedNextHref ? (
                                <Button asChild type="button" disabled={disableNext || isBusy}>
                                    <Link to={resolvedNextHref as any}>
                                        {nextLabel}
                                        <ArrowRight className="size-4"/>
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </section>
            </div>
        </Page>
    )
}
