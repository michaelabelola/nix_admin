import {Building2, BriefcaseBusiness, ShieldCheck} from 'lucide-react'

import {Badge} from '#/components/ui/badge.tsx'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '#/components/ui/card.tsx'

const highlights = [
    {
        icon: Building2,
        title: 'Organization admin workspace',
        description: 'This route is selected when the authenticated session carries an organization identifier.',
    },
    {
        icon: BriefcaseBusiness,
        title: 'Business-context routing',
        description: 'Users with an `orgID` stay on `/admin` but receive the business admin experience.',
    },
    {
        icon: ShieldCheck,
        title: 'Authenticated only',
        description: 'The route is protected and redirects unauthenticated visitors back to the login flow.',
    },
]

export function BusinessAdminPage({orgID}: { orgID: string }) {
    return (
        <main className="page-wrap grid min-h-[calc(100vh-4rem)] gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="grid gap-6">
                <Badge variant="outline" className="w-fit">
                    Business Admin
                </Badge>
                <div className="grid gap-4">
                    <h1 className="font-['Fraunces',serif] text-4xl font-bold tracking-tight sm:text-5xl">
                        Organization admin workspace.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-muted-foreground">
                        You are signed in with an organization context, so `/admin` resolves to the business admin experience.
                    </p>
                </div>

                <div className="grid gap-4">
                    {highlights.map((highlight) => (
                        <div key={highlight.title} className="grid gap-2 rounded-md border bg-card p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-md border bg-muted text-primary">
                                    <highlight.icon className="size-5"/>
                                </span>
                                <h2 className="text-lg font-semibold">{highlight.title}</h2>
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">{highlight.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Business admin</CardTitle>
                        <CardDescription>
                            This route is selected when the authenticated user has an organization ID.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <div className="rounded-md border bg-muted/40 p-4">
                            <p className="text-sm font-medium">Organization ID</p>
                            <p className="text-sm leading-7 text-muted-foreground">{orgID}</p>
                        </div>
                        <p className="text-sm leading-7 text-muted-foreground">
                            Build organization-scoped administration features here.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
