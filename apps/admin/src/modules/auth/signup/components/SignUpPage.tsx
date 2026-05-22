import {Building2, Sparkles, UserRoundPlus} from 'lucide-react'

import {Badge} from '@suiteonix/ui'

import {SignUpForm} from './SignUpForm.tsx'

const benefits = [
    {
        icon: UserRoundPlus,
        title: 'Structured onboarding',
        description: 'Create a user profile with the core identity, contact, and address details required by your backend.',
    },
    {
        icon: Building2,
        title: 'Ready for organization context',
        description: 'New accounts can still inherit entity context from a subdomain-aware Suiteonix workspace.',
    },
    {
        icon: Sparkles,
        title: 'Fast path to access',
        description: 'Register once, then move straight into login with the credentials you just created.',
    },
]

export function SignUpPage() {
    return (
        <main className="page-wrap grid min-h-[calc(100vh-4rem)] gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="grid gap-6">
                <Badge variant="outline" className="w-fit">
                    Suiteonix Registration
                </Badge>
                <div className="grid gap-4">
                    <h1 className="font-['Fraunces',serif] text-4xl font-bold tracking-tight sm:text-5xl">
                        Register a new workspace user.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-muted-foreground">
                        Create your Suiteonix account with the onboarding profile details required for access and downstream setup.
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
                <SignUpForm/>
            </section>
        </main>
    )
}
