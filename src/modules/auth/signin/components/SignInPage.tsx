import { Building2, KeyRound, ShieldCheck } from 'lucide-react'

import { Badge } from '#/components/ui/badge'

import { SignInForm } from './SignInForm'

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

export function SignInPage() {
  return (
    <main className="page-wrap grid min-h-[calc(100vh-4rem)] gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <section className="grid gap-6">
        <Badge variant="outline" className="w-fit">
          Suiteonix Sign In
        </Badge>
        <div className="grid gap-4">
          <h1 className="font-['Fraunces',serif] text-4xl font-bold tracking-tight sm:text-5xl">
            Access your agency workspace.
          </h1>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            Log in to manage your real estate operations, track active listings, and keep rentals, leases, and sales moving.
          </p>
        </div>

        <div className="grid gap-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="grid gap-2 rounded-md border bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md border bg-muted text-primary">
                  <benefit.icon className="size-5" />
                </span>
                <h2 className="text-lg font-semibold">{benefit.title}</h2>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SignInForm />
      </section>
    </main>
  )
}
