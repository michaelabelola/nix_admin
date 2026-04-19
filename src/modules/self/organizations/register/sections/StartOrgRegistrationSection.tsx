import {Link} from "@tanstack/react-router"
import {ArrowRight} from "lucide-react"

import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"

import {REGISTRATION_STEPS} from "../constants.ts"

export function StartOrgRegistrationSection() {
    const firstStep = REGISTRATION_STEPS[0]

    return (
        <section className="grid gap-6">
            <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background">
                <CardHeader className="space-y-3">
                    <CardTitle className="text-3xl">Register your organization</CardTitle>
                    <CardDescription className="max-w-3xl text-sm leading-7">
                        This multi-step flow will collect your business details, contact information,
                        legal registration data, owner profile, and branding assets before submitting
                        everything to the organization onboarding endpoint.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="grid gap-3">
                        {REGISTRATION_STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-start gap-3 rounded-lg border bg-background/70 p-4">
                                <div className="rounded-lg border bg-muted p-2 text-primary">
                                    <step.icon className="size-4"/>
                                </div>
                                <div>
                                    <div className="font-medium">
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
                                Keep your legal organization details, address information, owner profile, and any
                                optional images ready. You can move between steps before final submission.
                            </p>
                        </div>

                        <div className="grid gap-3 text-sm text-muted-foreground">
                            <p>Required details include business name, industry, registration country, addresses, contact details, and owner information.</p>
                            <p>Optional uploads include your avatar, logo, dark logo, and cover images.</p>
                        </div>

                        <div className="pt-2">
                            <Button asChild size="lg">
                                <Link to={firstStep.path}>
                                    Proceed to registration
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
