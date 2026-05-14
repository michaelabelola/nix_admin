import {Link} from "@tanstack/react-router"
import {
    ArrowRight,
    CheckCircle2,
    ClipboardCheck,
    FileCheck2,
    ShieldCheck,
    Sparkles,
    UploadCloud,
} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"

import {REGISTRATION_STEPS} from "../constants.ts"

const introHighlights = [
    {
        icon: ClipboardCheck,
        title: "Business profile",
        description: "Capture organization identity, industry, legal details, and contact channels.",
    },
    {
        icon: FileCheck2,
        title: "Owner details",
        description: "Add the profile information used to connect you with the organization.",
    },
    {
        icon: UploadCloud,
        title: "Brand assets",
        description: "Attach optional logo, cover, dark-mode, and owner photo assets before submission.",
    },
]

export function StartOrgRegistrationSection() {
    const firstStep = REGISTRATION_STEPS[0]

    return (
        <section className="grid min-h-full w-full overflow-hidden rounded-2xl border bg-background shadow-xl lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative min-h-140 overflow-hidden bg-foreground p-8 text-background sm:p-10">
                <img
                    src="/customer/portal-hero.png"
                    alt="Organization onboarding preview"
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-foreground/85"/>
                <div className="relative z-10 grid h-full content-between gap-8">
                    <div className="flex flex-wrap gap-2">
                        <Badge className="border-background/20 bg-background/10 text-background hover:bg-background/10">
                            Organization onboarding
                        </Badge>
                        <Badge className="border-background/20 bg-background/10 text-background hover:bg-background/10">
                            Business registration
                        </Badge>
                    </div>

                    <div className="grid max-w-xl gap-6">
                        <div className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/10">
                            <Sparkles className="size-6 text-background"/>
                        </div>
                        <div className="grid gap-4">
                            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                                Register your organization.
                            </h1>
                            <p className="max-w-lg text-base leading-8 text-background/80">
                                Set up your business profile, owner details, contact information, and brand assets in a guided flow before submitting for onboarding.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="bg-background text-foreground hover:bg-background/90"
                            >
                                <Link to={firstStep.path}>
                                    Get started
                                    <ArrowRight className="size-4"/>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="inverted_glass" className="border-background/30 bg-background/10 text-background hover:bg-background/20 hover:text-background">
                                <Link to="/self/organizations">View organizations</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {introHighlights.map((item) => (
                            <div key={item.title} className="rounded-xl border border-background/15 bg-background/10 p-4 backdrop-blur">
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
                    <Badge variant="outline" className="w-fit">Before you start</Badge>
                    <h2 className="text-3xl font-semibold tracking-tight">A focused setup for the information your organization profile needs.</h2>
                    <p className="text-muted-foreground">
                        The registration flow is split into short steps so business identity, legal details, address, contact data, owner profile, and images stay easy to review.
                    </p>
                </div>

                <div className="grid gap-3">
                    <IntroChecklistItem label="Keep your legal organization details and registration country ready."/>
                    <IntroChecklistItem label="Prepare organization and owner address and contact information."/>
                    <IntroChecklistItem label="Upload brand images now or leave optional asset fields blank."/>
                </div>

                <div className="rounded-xl border bg-muted/40 p-5">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 size-5 text-primary"/>
                        <div>
                            <div className="font-medium">Submission follows the final step</div>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                You can move between steps before submitting. Required fields are checked at the final registration action.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
