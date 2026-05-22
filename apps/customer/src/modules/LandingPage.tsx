import {Link} from "@tanstack/react-router"
import {
    ArrowRight,
    Bell,
    CheckCircle2,
    FileCheck2,
    LifeBuoy,
    LockKeyhole,
    MessageSquareText,
    ShieldCheck,
    UserRound,
} from "lucide-react"
import {Badge, Button, Progress} from "@suiteonix/ui";

const valueProps = [
    {
        icon: FileCheck2,
        title: "Documents and records",
        description: "Review files, agreements, verification notes, and shared account records from a single place.",
    },
    {
        icon: Bell,
        title: "Account updates",
        description: "Stay current on verification, service activity, and profile changes without chasing email threads.",
    },
    {
        icon: MessageSquareText,
        title: "Support with context",
        description: "Send requests with the details your service team needs to understand the account quickly.",
    },
]

const portalStats = [
    {label: "Profile completion", value: "82", display: "82%"},
    {label: "Documents reviewed", value: "68", display: "68%"},
    {label: "Support readiness", value: "91", display: "91%"},
]

export function LandingPage() {
    return (
        <main className="min-h-dvh bg-background">
            <section
                className="relative min-h-[92dvh] overflow-hidden bg-cover bg-center text-white"
                style={{backgroundImage: "url('/customer/portal-hero.png')"}}
            >
                <div className="absolute inset-0 bg-black/65"/>
                <div
                    className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76),rgba(0,0,0,0.46),rgba(0,0,0,0.22))]"/>

                <div className="relative z-10 mx-auto flex min-h-[92dvh] w-full max-w-7xl flex-col px-4 py-5">
                    <header className="flex items-center justify-between gap-4">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logo192.png" alt="Suiteonix" className="size-9 rounded-md"/>
                            <span
                                className="text-sm font-semibold uppercase tracking-[0.16em]">Suiteonix Customer</span>
                        </Link>
                        <nav className="flex items-center gap-2">
                            <Button asChild variant="secondary" size="sm">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link to="/register">Register</Link>
                            </Button>
                        </nav>
                    </header>

                    <div className="grid flex-1 content-end gap-10 pb-10 pt-20 lg:grid-cols-[1fr_390px] lg:items-end">
                        <div className="max-w-3xl">
                            <Badge className="mb-6 bg-white/15 text-white hover:bg-white/15">
                                Customer self-service portal
                            </Badge>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
                                Customer Portal
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
                                Access your customer account, keep profile information current, review shared records,
                                and stay connected to service updates.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="h-12 px-6">
                                    <Link to="/register">
                                        Create customer account
                                        <ArrowRight className="size-4"/>
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="secondary" className="h-12 px-6">
                                    <Link to="/login">Login to portal</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="border border-white/15 bg-black/35 p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/65">Portal snapshot</p>
                                    <h2 className="mt-1 text-xl font-semibold">Account readiness</h2>
                                </div>
                                <UserRound className="size-6 text-white/70"/>
                            </div>
                            <div className="mt-5 space-y-5">
                                {portalStats.map((stat) => (
                                    <div key={stat.label}>
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span className="text-white/70">{stat.label}</span>
                                            <span className="font-medium">{stat.display}</span>
                                        </div>
                                        <Progress
                                            value={Number(stat.value)}
                                            className="bg-white/15 [&_[data-slot=progress-indicator]]:bg-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b py-16 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.78fr_1.22fr]">
                    <div>
                        <Badge variant="outline">Built for customers</Badge>
                        <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                            A focused account space without the admin noise.
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                            Customers get a simple route to register, sign in, and maintain the details used across
                            service workflows.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {valueProps.map((item) => (
                            <article key={item.title} className="border bg-card p-5">
                                <item.icon className="size-6 text-primary"/>
                                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-muted/35 py-16">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3">
                    <TrustItem icon={LockKeyhole} title="Secure access"
                               text="Credentials are created during registration and used for future customer login."/>
                    <TrustItem icon={ShieldCheck} title="Verified profile"
                               text="Submitted accounts are ready for downstream verification and service review."/>
                    <TrustItem icon={LifeBuoy} title="Service-ready"
                               text="Contact, address, and preference details help support teams act with context."/>
                </div>
            </section>

            <section className="py-16 sm:py-20">
                <div
                    className="mx-auto flex max-w-7xl flex-col gap-6 border bg-foreground px-6 py-10 text-background sm:px-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-background/70">Start here</p>
                        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Open your customer portal account.</h2>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" variant="secondary">
                            <Link to="/register">
                                Register
                                <ArrowRight className="size-4"/>
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline"
                                className="border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground">
                            <Link to="/login" search={{email: ""}}>Login</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}

function TrustItem({
                       icon: Icon,
                       title,
                       text,
                   }: {
    icon: typeof CheckCircle2
    title: string
    text: string
}) {
    return (
        <article className="border bg-background p-5">
            <Icon className="size-6 text-primary"/>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
        </article>
    )
}
