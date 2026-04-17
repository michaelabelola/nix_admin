import {UserRound, ShieldCheck, Workflow} from 'lucide-react'

import {Badge} from '#/components/ui/badge'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '#/components/ui/card'

const highlights = [
    {
        icon: UserRound,
        title: 'Personal admin workspace',
        description: 'Manage your own profile-level administration tasks from a single entry point.',
    },
    {
        icon: ShieldCheck,
        title: 'Protected access',
        description: 'This area is only available after a successful authenticated session is present.',
    },
    {
        icon: Workflow,
        title: 'Ready for expansion',
        description: 'Use this surface for account settings, personal tools, and non-organization admin workflows.',
    },
]

export function UserAdminPage() {
    return (
        <main className="page-wrap grid min-h-[calc(100vh-4rem)] gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="grid gap-6">
                <Badge variant="outline" className="w-fit">
                    User Admin
                </Badge>
                <div className="grid gap-4">
                    <h1 className="font-['Fraunces',serif] text-4xl font-bold tracking-tight sm:text-5xl">
                        Personal admin workspace.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-muted-foreground">
                        You are signed in without an organization context, so `/admin` resolves to the user admin experience.
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
                        <CardTitle className="text-2xl">User admin</CardTitle>
                        <CardDescription>
                            This route is selected when the authenticated user does not have an `orgID`.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-7 text-muted-foreground">
                            Build personal administration features here.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
