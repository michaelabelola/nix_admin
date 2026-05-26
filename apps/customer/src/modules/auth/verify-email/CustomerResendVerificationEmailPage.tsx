import {useEffect} from "react"
import {useForm, useStore} from "@tanstack/react-form"
import {Link} from "@tanstack/react-router"
import {MailCheck, RefreshCw, ShieldAlert} from "lucide-react"

import {CustomerRequest} from "@suiteonix/server"
import {
    Alert,
    AlertDescription,
    AlertTitle,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
} from "@suiteonix/ui"

const benefits = [
    {
        icon: MailCheck,
        title: "Request a fresh verification email",
        description: "Send another customer verification message when the original email expired or never arrived.",
    },
    {
        icon: ShieldAlert,
        title: "Use your registered email",
        description: "The customer verification endpoint only needs the email address used during registration.",
    },
    {
        icon: RefreshCw,
        title: "Return to verification quickly",
        description: "After the message is sent, continue to the verification page and enter the new token.",
    },
]

type ResendVerificationFormValues = {
    email: string
}

function validateEmail(value: string) {
    if (!value.trim()) {
        return "Email is required"
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Enter a valid email address"
    }

    return undefined
}

export function CustomerResendVerificationEmailPage({initialEmail = ""}: { initialEmail?: string }) {
    const resendVerification = CustomerRequest.useResendCustomerVerificationEmail()

    const form = useForm({
        defaultValues: {
            email: initialEmail,
        } satisfies ResendVerificationFormValues,
        onSubmit: async ({value}) => {
            await resendVerification.mutateAsync({
                email: value.email.trim(),
            })
        },
    })

    useEffect(() => {
        form.setFieldValue("email", initialEmail)
    }, [form, initialEmail])

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    return (
        <main className="page-wrap grid min-h-dvh gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="grid gap-6">
                <Badge variant="outline" className="w-fit">
                    Email Verification
                </Badge>
                <div className="grid gap-4">
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        Resend your customer verification email.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-muted-foreground">
                        Submit the email address tied to your Suiteonix customer account and request a new verification message.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline">
                            <Link to="/login" search={{email: form.state.values.email}}>
                                Back to login
                            </Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link to="/verify-email" search={{email: form.state.values.email, token: ""}}>
                                Already have a code?
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="grid gap-2 border bg-background p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center border bg-muted text-primary">
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
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Resend verification</CardTitle>
                        <CardDescription>
                            Request another customer email so you can complete account verification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="grid gap-5"
                            onSubmit={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                void form.handleSubmit()
                            }}
                        >
                            <form.Field
                                name="email"
                                validators={{
                                    onChange: ({value}) => validateEmail(value),
                                }}
                            >
                                {(field) => (
                                    <div className="grid gap-2">
                                        <Label htmlFor={field.name}>Email</Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            value={field.state.value}
                                            placeholder="you@example.com"
                                            onBlur={field.handleBlur}
                                            onChange={(event) => field.handleChange(event.target.value)}
                                        />
                                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                                            <div className="space-y-1 text-sm text-destructive">
                                                {field.state.meta.errors.map((error) => (
                                                    <small key={String(error)}>{String(error)}</small>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </form.Field>

                            {resendVerification.isSuccess ? (
                                <Alert>
                                    <AlertTitle>Verification email sent</AlertTitle>
                                    <AlertDescription className="grid gap-4">
                                        <span>
                                            Check your inbox and use the verification token in that message to activate your customer account.
                                        </span>
                                        <div className="flex justify-end">
                                            <Button asChild variant="outline">
                                                <Link
                                                    to="/verify-email"
                                                    search={{email: form.state.values.email, token: ""}}
                                                >
                                                    Continue
                                                </Link>
                                            </Button>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            {resendVerification.isError ? (
                                <Alert variant="destructive">
                                    <AlertTitle>Request failed</AlertTitle>
                                    <AlertDescription>
                                        {resendVerification.error?.message || "We could not resend the verification email."}
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            <Button type="submit" disabled={isSubmitting || resendVerification.isPending}>
                                {isSubmitting || resendVerification.isPending ? "Sending..." : "Resend verification email"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
