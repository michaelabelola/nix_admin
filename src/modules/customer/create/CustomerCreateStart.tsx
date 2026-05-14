import {Link} from "@tanstack/react-router"
import {ArrowRight} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"

import {CUSTOMER_CREATE_STEPS} from "./customer-create.constants.ts"

export function CustomerCreateStart() {
    const firstStep = CUSTOMER_CREATE_STEPS[0]

    return (
        <section className="grid gap-6">
            <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background">
                <CardHeader className="space-y-3">
                    <CardTitle className="text-3xl">Create a customer in guided steps</CardTitle>
                    <CardDescription className="max-w-3xl text-sm leading-7">
                        This flow breaks customer creation into route-based steps for basics, identity details,
                        business data, contact channels, addresses, and preferences. The backend create request
                        is sent only once after the final review.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="grid gap-3">
                        {CUSTOMER_CREATE_STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-start gap-3 rounded-lg border bg-background/70 p-4">
                                <div className="rounded-lg border bg-muted p-2 text-primary">
                                    <step.icon className="size-4"/>
                                </div>
                                <div>
                                    <div className="text-sm">
                                        {index + 1}. {step.label}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {step.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-4 rounded-xl border bg-background/70 p-5">
                        <div>
                            <h2 className="text-lg font-semibold">Before you proceed</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Prepare the core customer name, type, lifecycle stage, any personal or business
                                identity details, address data, and optional tag or segment ids.
                            </p>
                        </div>

                        <div className="grid gap-3 text-sm text-muted-foreground">
                            <p>Only the basics step is required to submit, but each later step lets you capture the rest of the create payload up front.</p>
                            <p>You can move between step URLs before submission without sending partial data to the backend.</p>
                        </div>

                        <div className="pt-2">
                            <Button asChild size="lg">
                                <Link to={firstStep.path}>
                                    Start customer setup
                                    <ArrowRight className="size-4"/>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
