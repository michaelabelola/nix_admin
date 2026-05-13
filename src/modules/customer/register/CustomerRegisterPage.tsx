import {Link} from "@tanstack/react-router"
import {
    ArrowRight,
    CheckCircle2,
    ClipboardCheck,
    FileCheck2,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog.tsx"

import {CustomerRegisterProvider, useCustomerRegister} from "./customer-register.context.tsx"
import {CustomerRegisterAddressesStep} from "./steps/CustomerRegisterAddressesStep.tsx"
import {CustomerRegisterAccountStep} from "./steps/CustomerRegisterAccountStep.tsx"
import {CustomerRegisterContactStep} from "./steps/CustomerRegisterContactStep.tsx"
import {CustomerRegisterPreferencesStep} from "./steps/CustomerRegisterPreferencesStep.tsx"
import {CustomerRegisterProfileStep} from "./steps/CustomerRegisterProfileStep.tsx"
import {CustomerRegisterReviewStep} from "./steps/CustomerRegisterReviewStep.tsx"

export function CustomerRegisterPage() {
    return (
        <CustomerRegisterProvider>
            <main className="min-h-dvh bg-background">
                <div className="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 py-6">
                    <CustomerRegisterHeader/>
                    <div className="flex flex-1 py-8">
                        <CustomerRegisterCurrentStep/>
                    </div>
                    <CustomerRegisterSuccessDialog/>
                </div>
            </main>
        </CustomerRegisterProvider>
    )
}

function CustomerRegisterHeader() {
    return (
        <header className="flex items-center justify-between gap-4">
            <Link to="/customer" className="flex items-center gap-3">
                <img src="/logo192.png" alt="Suiteonix" className="size-10 rounded-md shadow-sm"/>
                <div>
                    <div className="font-semibold tracking-tight">Suiteonix Customer</div>
                    <div className="text-xs text-muted-foreground">Account registration</div>
                </div>
            </Link>
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                    <Link to="/customer">Customer home</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <Link to="/customer/login">Login</Link>
                </Button>
            </div>
        </header>
    )
}

function CustomerRegisterCurrentStep() {
    const {stepId} = useCustomerRegister()

    switch (stepId) {
        case "intro":
            return <CustomerRegisterIntro/>
        case "profile":
            return <CustomerRegisterProfileStep/>
        case "contact":
            return <CustomerRegisterContactStep/>
        case "addresses":
            return <CustomerRegisterAddressesStep/>
        case "preferences":
            return <CustomerRegisterPreferencesStep/>
        case "review":
            return <CustomerRegisterReviewStep/>
        case "account":
        default:
            return <CustomerRegisterAccountStep/>
    }
}

const introHighlights = [
    {
        icon: LockKeyhole,
        title: "Secure credentials",
        description: "Create the email and password used for customer portal access.",
    },
    {
        icon: ClipboardCheck,
        title: "Complete profile",
        description: "Add the details your account needs before services begin.",
    },
    {
        icon: FileCheck2,
        title: "Ready for verification",
        description: "Submit once, then verify from the email sent by Suiteonix.",
    },
]

function CustomerRegisterIntro() {
    const {startRegistration} = useCustomerRegister()

    return (
        <section className="grid min-h-full w-full overflow-hidden rounded-2xl border bg-background shadow-xl lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative min-h-140 overflow-hidden bg-foreground p-8 text-background sm:p-10">
                <img
                    src="/customer/portal-hero.png"
                    alt="Customer portal preview"
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-foreground/80"/>
                <div className="relative z-10 grid h-full content-between gap-8">
                    <div className="flex flex-wrap gap-2">
                        <Badge className="border-background/20 bg-background/10 text-background hover:bg-background/10">
                            Customer onboarding
                        </Badge>
                        <Badge className="border-background/20 bg-background/10 text-background hover:bg-background/10">
                            Self-service access
                        </Badge>
                    </div>

                    <div className="grid max-w-xl gap-6">
                        <div className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/10">
                            <Sparkles className="size-6 text-background"/>
                        </div>
                        <div className="grid gap-4">
                            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                                Create your customer account.
                            </h1>
                            <p className="max-w-lg text-base leading-8 text-background/80">
                                Set up secure customer portal access, complete your profile, and prepare your account for verification in a guided flow.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                type="button"
                                size="lg"
                                className="bg-background text-foreground hover:bg-background/90"
                                onClick={startRegistration}
                            >
                                Get started
                                <ArrowRight className="size-4"/>
                            </Button>
                            <Button asChild size="lg" variant="inverted_glass" className="border-background/30 bg-background/10 text-background hover:bg-background/20 hover:text-background">
                                <Link to="/customer/login">I already have an account</Link>
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
                    <h2 className="text-3xl font-semibold tracking-tight">A focused setup that only asks for what the customer account needs.</h2>
                    <p className="text-muted-foreground">
                        The registration flow is split into short steps so credentials, profile information, contact channels, addresses, and preferences stay easy to review.
                    </p>
                </div>

                <div className="grid gap-3">
                    <IntroChecklistItem label="Use a valid email you can verify."/>
                    <IntroChecklistItem label="Create a password for future customer portal login."/>
                    <IntroChecklistItem label="Add optional profile and address details now or leave them blank."/>
                </div>

                <div className="rounded-xl border bg-muted/40 p-5">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 size-5 text-primary"/>
                        <div>
                            <div className="font-medium">Verification follows registration</div>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                After submission, a confirmation dialog will send you to customer login. Complete email verification when the message arrives.
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

function CustomerRegisterSuccessDialog() {
    const {successEmail, closeSuccessDialog} = useCustomerRegister()

    return (
        <Dialog open={Boolean(successEmail)} onOpenChange={(open) => {
            if (!open) closeSuccessDialog()
        }}>
            <DialogContent showCloseButton={false}>
                <DialogHeader className="items-center text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
                        <CheckCircle2 className="size-8"/>
                    </div>
                    <DialogTitle>Registration submitted</DialogTitle>
                    <DialogDescription>
                        Your customer account was created for {successEmail}. Check your email for verification, then continue to customer login.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button asChild>
                        <Link to="/customer/login">Go to customer login</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
