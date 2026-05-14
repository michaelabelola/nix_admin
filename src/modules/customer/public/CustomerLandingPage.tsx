import {Link} from "@tanstack/react-router"
import {
    ArrowRight,
    Bell,
    Building2,
    FileCheck2,
    LifeBuoy,
    LockKeyhole,
    MessageSquareText,
    ShieldCheck,
} from "lucide-react"

import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import HERO_IMAGE from "/customer/portal-hero.png"
import LOGO from "/logo192.png"
// const HERO_IMAGE = "/customer/portal-hero.png"

const valueProps = [
    {
        icon: FileCheck2,
        title: "Documents in one place",
        description: "Review account files, agreements, and shared records without chasing email threads.",
    },
    {
        icon: Bell,
        title: "Clear account updates",
        description: "Track verification, service activity, and profile changes from a single customer view.",
    },
    {
        icon: MessageSquareText,
        title: "Support with context",
        description: "Send requests with the details your service team needs to move quickly.",
    },
]

const trustItems = [
    {label: "Secure access", icon: LockKeyhole},
    {label: "Verified profile", icon: ShieldCheck},
    {label: "Service-ready", icon: LifeBuoy},
]

export function CustomerLandingPage() {
    return (
        <main className="min-h-screen">
            <section className="relative min-h-[88vh] overflow-hidden bg-foreground text-background">
                <img
                    src={HERO_IMAGE}
                    alt="Customer portal displayed on laptop and phone"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-background/20 dark:bg-background/75"/>

                <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col px-4 py-6">
                    <header className="flex items-center justify-between gap-4">
                        <Link to="/customer" className="flex items-center gap-3">
                            <img src={LOGO} alt="Suiteonix" className="size-10 rounded-md"/>
                            <span className="font-semibold">Suiteonix Customer Portal</span>
                        </Link>
                        <nav className="flex items-center gap-2">
                            <Button asChild variant="secondary" size="sm">
                                <Link to="/customer/login">Login</Link>
                            </Button>
                            <Button asChild size="sm" className={"hover:text-background"}>
                                <Link to="/customer/register">Register</Link>
                            </Button>
                        </nav>
                    </header>

                    <div className="grid flex-1 content-center gap-8 py-14 lg:max-w-2xl">
                        <Badge className="w-fit" variant={"glass"}>
                            Customer self-service portal
                        </Badge>
                        <div className="grid gap-5">
                            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                                Customer Portal
                            </h1>
                            <p className="max-w-xl text-lg leading-8 text-background/80">
                                Access your customer account, keep profile information current, and stay connected to
                                the services, documents, and updates that matter.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button asChild variant={"glass"} size="lg">
                                <Link to="/customer/register">
                                    Create customer account
                                    <ArrowRight className="size-4"/>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="ghost">
                                <Link to="/customer/login">Login to portal</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-3 pb-2 sm:grid-cols-3 lg:max-w-2xl">
                        {trustItems.map((item) => (
                            <div key={item.label}
                                 className="flex items-center gap-3 rounded-md border border-background/15 bg-background/10 px-4 py-3 backdrop-blur">
                                <item.icon className="size-4 text-background"/>
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
                // style={{background: `linear-gradient(to right, oklch(0.18 0.03 259.92) 50%, transparent 100%)`}}
            >
                <div className="grid gap-4">
                    <Badge variant="outline" className="w-fit">Built for customers</Badge>
                    <h2 className="text-3xl font-semibold tracking-tight">Everything needed to manage an account without
                        waiting on an admin.</h2>
                    <p className="text-muted-foreground">
                        The portal gives customers a focused place to register, sign in, and manage the information your
                        backend uses across service workflows.
                    </p>
                    <Button asChild variant="outline" className="w-fit">
                        <Link to="/customer/register">
                            Start registration
                            <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {valueProps.map((item) => (
                        <Card key={item.title}>
                            <CardHeader>
                                <div
                                    className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <item.icon className="size-5"/>
                                </div>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm leading-6 text-muted-foreground">
                                {item.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="border-y bg-muted/35">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
                    <Metric value="01" label="Create a verified customer account"/>
                    <Metric value="02" label="Keep profile and contact details current"/>
                    <Metric value="03" label="Use one login for service and document access"/>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1fr_auto] md:items-center">
                <div className="grid gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Building2 className="size-4"/>
                        Suiteonix Customer Access
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight">Ready to open your customer portal?</h2>
                    <p className="max-w-2xl text-muted-foreground">
                        Register now and complete verification when your email arrives.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild>
                        <Link to="/customer/register">Register</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link to="/customer/login">Login</Link>
                    </Button>
                </div>
            </section>
        </main>
    )
}

function Metric({value, label}: { value: string; label: string }) {
    return (
        <div className="grid gap-2">
            <div className="text-4xl font-semibold text-primary">{value}</div>
            <div className="text-sm font-medium text-muted-foreground">{label}</div>
        </div>
    )
}
