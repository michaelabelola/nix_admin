import {Building2, KeyRound, ShieldCheck} from 'lucide-react'

import {Badge} from '#/components/ui/badge.tsx'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '#/components/ui/tabs.tsx'
import {SignInForm} from '#/modules/auth/signin/components/SignInForm.tsx'
import {SignUpForm} from '#/modules/auth/signup/components/SignUpForm.tsx'

const benefits = [
    {
        icon: Building2,
        title: 'Business-ready setup',
        description: 'Workspaces are built for agencies handling listings, client follow-up, and day-to-day property operations.',
    },
    {
        icon: KeyRound,
        title: 'One login, full workflow',
        description: 'Sign in to manage listings, leasing activity, property sales, and your team from one place.',
    },
    {
        icon: ShieldCheck,
        title: 'Organization-aware access',
        description: 'When you open Suiteonix from an entity subdomain, your organization context is captured automatically.',
    },
]

export function AuthPage() {
    return (
        <main className="page-wrap grid min-h-[calc(100vh-4rem)] gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="grid gap-6">
                <Badge variant="outline" className="w-fit">
                    Suiteonix Access
                </Badge>
                <div className="grid gap-4">
                    <h1 className="font-['Fraunces',serif] text-4xl font-bold tracking-tight sm:text-5xl">
                        Access or create your agency workspace.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-muted-foreground">
                        Sign in to continue your real estate workflow, or register a new user profile with the onboarding details your backend expects.
                    </p>
                </div>

                <div className="grid gap-4">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="grid gap-2 rounded-md border bg-card p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-md border bg-muted text-primary">
                                    <benefit.icon className="size-5"/>
                                </span>
                                <h2 className="text-lg font-semibold">{benefit.title}</h2>
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <Tabs defaultValue="signin" className="gap-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign in</TabsTrigger>
                        <TabsTrigger value="signup">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <SignInForm/>
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignUpForm/>
                    </TabsContent>
                </Tabs>
            </section>
        </main>
    )
}
