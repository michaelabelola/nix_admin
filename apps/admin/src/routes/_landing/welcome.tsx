import {createFileRoute, Link} from "@tanstack/react-router"
import {
    ArrowRight,
    BarChart3,
    Building2,
    Check,
    CircleDollarSign,
    ClipboardList,
    HomeIcon,
    KeyRound,
    LayoutDashboard,
    MessageSquareText,
    ShieldCheck,
    Users,
} from "lucide-react"

import ThemeToggle from "#/components/ThemeToggle.tsx"
import {Avatar, AvatarFallback, AvatarImage} from "@suiteonix/ui"
import {Badge} from "@suiteonix/ui"
import {Button} from "@suiteonix/ui"
import {Progress} from "@suiteonix/ui"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@suiteonix/ui"
import logo from "#/assets/logo.png"

export const Route = createFileRoute("/_landing/welcome")({component: App})

const heroStats = [
    {label: "Active listings", value: "48k+"},
    {label: "Monthly inquiries", value: "96k+"},
    {label: "Agency workspaces", value: "1.2k+"},
]

const workflows = [
    {
        icon: Building2,
        title: "Launch the business",
        description: "Register your agency, configure roles, and get a shared workspace ready for real estate operations.",
    },
    {
        icon: HomeIcon,
        title: "Publish inventory",
        description: "Create properties, attach listing snapshots, add media, and keep availability clear for every team member.",
    },
    {
        icon: KeyRound,
        title: "Run deals",
        description: "Move prospects through rent, lease, and sale workflows without losing ownership or context.",
    },
]

const liveRows = [
    {property: "Harbor View Duplex", stage: "Lease review", owner: "Ada", value: "$3,400"},
    {property: "Cedar Peak Studio", stage: "New inquiry", owner: "Marcus", value: "$1,850"},
    {property: "Northline Townhouse", stage: "Offer sent", owner: "Leila", value: "$612k"},
]

const plans = [
    {
        name: "Starter",
        price: "$29",
        description: "For solo agents getting online quickly.",
        features: ["Business profile", "20 active listings", "Lead inbox", "Property records"],
    },
    {
        name: "Growth",
        price: "$79",
        featured: true,
        description: "For teams coordinating listings and follow-up.",
        features: ["Unlimited listings", "Multi-agent workspace", "Rent and lease tracking", "Performance dashboard"],
    },
    {
        name: "Scale",
        price: "$149",
        description: "For agencies managing high-volume inventory.",
        features: ["Role-based access", "Portfolio views", "Priority support", "Advanced reporting"],
    },
]

const team = [
    {name: "Michael Abel", role: "Founder/CTO"},
    {name: "Tara Benson", role: "Platform Engineering"},
    {name: "Michael Fraser", role: "Finance and Growth"},
    {name: "Nina Solis", role: "Brand and Community"},
]

const faqs = [
    {
        question: "Who is Suiteonix for?",
        answer: "Real estate agents and growing agencies that need one place to launch their business, manage listings, and coordinate rent, lease, or sales activity.",
    },
    {
        question: "Can my team work from the same account?",
        answer: "Yes. Suiteonix supports team workspaces, agent ownership, and shared operational views for listings and inquiries.",
    },
    {
        question: "Does it support rentals and sales?",
        answer: "Yes. You can track rental, lease, and sale workflows from the same property operating system.",
    },
]

function App() {
    return (
        <div className="min-h-dvh bg-background text-foreground">
            <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-background/75 backdrop-blur-xl">
                <div className="page-wrap flex items-center justify-between py-3">
                    <a href="#top" className="flex items-center gap-3">
                        <Avatar className="size-9 rounded-md">
                            <AvatarImage src={logo} alt="Suiteonix"/>
                            <AvatarFallback>NIX</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold uppercase tracking-[0.18em]">Suiteonix</span>
                    </a>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                        <a href="#workflow" className="hover:text-foreground">Workflow</a>
                        <a href="#operations" className="hover:text-foreground">Operations</a>
                        <a href="#pricing" className="hover:text-foreground">Pricing</a>
                        <a href="#team" className="hover:text-foreground">Team</a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle/>
                        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                            <Link to="/login" search={{email: ""}}>Login</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link to="/signup">Start</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main id="top">
                <section
                    className="relative min-h-[92dvh] overflow-hidden bg-cover bg-center pt-24 text-white"
                    style={{backgroundImage: "url('/customer/portal-hero.png')"}}
                >
                    <div className="absolute inset-0 bg-black/65"/>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.75),rgba(0,0,0,0.42),rgba(0,0,0,0.2))]"/>

                    <div className="page-wrap relative grid min-h-[calc(92dvh-6rem)] content-end gap-10 pb-10 lg:grid-cols-[1fr_420px] lg:items-end">
                        <div className="max-w-3xl pb-4">
                            <Badge className="mb-6 bg-white/15 text-white hover:bg-white/15">
                                Real estate operating system
                            </Badge>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
                                Suiteonix
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
                                Launch your agency, publish property inventory, and manage rent, lease, or sales workflows from one focused workspace.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="h-12 px-6">
                                    <Link to="/signup">
                                        Create account
                                        <ArrowRight className="size-4"/>
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="secondary" className="h-12 px-6">
                                    <Link to="/login" search={{email: ""}}>Login</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="mb-4 border border-white/15 bg-black/35 p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/65">Today</p>
                                    <h2 className="mt-1 text-xl font-semibold">Agency activity</h2>
                                </div>
                                <LayoutDashboard className="size-6 text-white/70"/>
                            </div>
                            <div className="mt-5 space-y-4">
                                {heroStats.map((stat) => (
                                    <div key={stat.label} className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                                        <span className="text-sm text-white/70">{stat.label}</span>
                                        <span className="text-2xl font-semibold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="workflow" className="border-b bg-background py-16 sm:py-20">
                    <div className="page-wrap">
                        <SectionIntro
                            eyebrow="Workflow"
                            title="Start with the work your agency does every day."
                            description="Suiteonix keeps setup, inventory, and deal movement close together so teams can act without switching systems."
                        />
                        <div className="mt-10 grid gap-5 lg:grid-cols-3">
                            {workflows.map((item) => (
                                <article key={item.title} className="border bg-card p-6">
                                    <item.icon className="size-7 text-primary"/>
                                    <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="operations" className="bg-muted/35 py-16 sm:py-20">
                    <div className="page-wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div>
                            <SectionIntro
                                eyebrow="Operations"
                                title="A live desk for listings, leads, and revenue."
                                description="Track what is available, what needs attention, and which deals are moving without hiding the operational details."
                            />
                            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                <Metric icon={MessageSquareText} label="Inquiry response" value="14 min" progress={78}/>
                                <Metric icon={CircleDollarSign} label="Rent collection" value="92%" progress={92}/>
                                <Metric icon={BarChart3} label="Listing health" value="84%" progress={84}/>
                            </div>
                        </div>

                        <div className="border bg-background p-4 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Pipeline</p>
                                    <h3 className="mt-1 text-lg font-semibold">Active property work</h3>
                                </div>
                                <Badge variant="outline">Live</Badge>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Stage</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead className="text-right">Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {liveRows.map((row) => (
                                        <TableRow key={row.property}>
                                            <TableCell className="font-medium">{row.property}</TableCell>
                                            <TableCell>{row.stage}</TableCell>
                                            <TableCell>{row.owner}</TableCell>
                                            <TableCell className="text-right">{row.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="border-y py-16 sm:py-20">
                    <div className="page-wrap">
                        <SectionIntro
                            eyebrow="Pricing"
                            title="Plans that match the stage of the agency."
                            description="Start lean, then add team coordination and reporting when your inventory grows."
                        />
                        <div className="mt-10 grid gap-5 lg:grid-cols-3">
                            {plans.map((plan) => (
                                <article
                                    key={plan.name}
                                    className={`border bg-card p-6 ${plan.featured ? "border-primary shadow-sm" : ""}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold">{plan.name}</h3>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                                        </div>
                                        {plan.featured ? <Badge>Popular</Badge> : null}
                                    </div>
                                    <div className="mt-6 flex items-end gap-2">
                                        <span className="text-4xl font-semibold">{plan.price}</span>
                                        <span className="pb-1 text-sm text-muted-foreground">/ month</span>
                                    </div>
                                    <ul className="mt-6 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-sm">
                                                <Check className="mt-0.5 size-4 text-primary"/>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild className="mt-7 w-full" variant={plan.featured ? "default" : "outline"}>
                                        <Link to="/signup">Choose {plan.name}</Link>
                                    </Button>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="team" className="bg-background py-16 sm:py-20">
                    <div className="page-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                        <SectionIntro
                            eyebrow="Team"
                            title="Built by operators for practical property teams."
                            description="The platform is shaped around real estate workflows: listing, follow-up, agreements, and revenue visibility."
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            {team.map((member) => (
                                <article key={member.name} className="flex items-center gap-4 border bg-card p-4">
                                    <Avatar className="size-12">
                                        <AvatarFallback>
                                            {member.name.split(" ").map((part) => part[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{member.name}</h3>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-muted/35 py-16 sm:py-20">
                    <div className="page-wrap grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
                        <SectionIntro
                            eyebrow="Questions"
                            title="What teams usually ask before getting started."
                            description="A quick view of fit, team setup, and workflow coverage."
                        />
                        <div className="divide-y border bg-background">
                            {faqs.map((faq) => (
                                <div key={faq.question} className="p-5">
                                    <h3 className="font-semibold">{faq.question}</h3>
                                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20">
                    <div className="page-wrap border bg-foreground p-8 text-background sm:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-sm font-medium uppercase tracking-[0.18em] text-background/70">Ready to launch</p>
                                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Put your agency and property pipeline on one system.</h2>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" variant="secondary">
                                    <Link to="/signup">Create account</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground">
                                    <Link to="/login" search={{email: ""}}>Login</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t">
                <div className="page-wrap flex flex-col gap-3 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <span>Suiteonix helps real estate teams manage property operations with less friction.</span>
                    <span className="inline-flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5"><Users className="size-4"/> Team-ready</span>
                        <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4"/> Role-aware</span>
                    </span>
                </div>
            </footer>
        </div>
    )
}

function SectionIntro({
                          eyebrow,
                          title,
                          description,
                      }: {
    eyebrow: string
    title: string
    description: string
}) {
    return (
        <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
        </div>
    )
}

function Metric({
                    icon: Icon,
                    label,
                    value,
                    progress,
                }: {
    icon: typeof ClipboardList
    label: string
    value: string
    progress: number
}) {
    return (
        <div className="border bg-background p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center bg-muted">
                        <Icon className="size-5 text-primary"/>
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-xl font-semibold">{value}</span>
            </div>
            <Progress value={progress} className="mt-4"/>
        </div>
    )
}
