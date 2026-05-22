import {createFileRoute, Link} from '@tanstack/react-router'
import {ArrowLeft, BookOpen, Braces, Clock, KeyRound, ShieldCheck} from 'lucide-react'
import type {ComponentType} from 'react'

import {Button} from '@suiteonix/ui'
import {Badge} from "@suiteonix/ui";

export const Route = createFileRoute('/_docs/api_docs/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main className="min-h-screen text-foreground">
            <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
                <header className="flex items-center justify-between gap-4">
                    <Link to="/welcome"
                          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        <ArrowLeft className="size-4"/>
                        Suiteonix
                    </Link>
                    <Badge variant="secondary" className="gap-2">
                        <Clock className="size-3.5"/>
                        Coming soon
                    </Badge>
                </header>

                <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_420px]">
                    <div className="max-w-3xl space-y-8">
                        <div className="space-y-5">
                            <div
                                className="inline-flex size-14 items-center justify-center rounded-md border bg-muted/40">
                                <BookOpen className="size-7"/>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">API
                                    documentation</p>
                                <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
                                    Developer docs are being prepared.
                                </h1>
                                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                                    Reference guides, authentication examples, endpoint catalogs, and integration notes
                                    will be available here soon.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link to="/login" search={{
                                    email: ""
                                }}>Go to dashboard</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/welcome">Back to home</Link>
                            </Button>
                        </div>
                    </div>

                    <aside className="grid gap-3">
                        <PreviewRow icon={Braces} title="Endpoint reference"
                                    description="Routes, payloads, status codes, and examples."/>
                        <PreviewRow icon={KeyRound} title="Authentication"
                                    description="API keys, bearer tokens, and request signing."/>
                        <PreviewRow icon={ShieldCheck} title="Operational notes"
                                    description="Rate limits, errors, webhooks, and versioning."/>
                    </aside>
                </div>
            </section>
        </main>
    )
}

function PreviewRow({
                        icon: Icon,
                        title,
                        description,
                    }: {
    icon: ComponentType<{ className?: string }>
    title: string
    description: string
}) {
    return (
        <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-5 text-muted-foreground"/>
                </div>
                <div className="min-w-0 space-y-1">
                    <h2 className="text-base font-medium">{title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
            </div>
        </div>
    )
}
