import {useEffect, useRef} from "react"
import {useForm, useStore} from "@tanstack/react-form"
import {Link} from "@tanstack/react-router"
import {KeyRound, MailCheck, ShieldCheck} from "lucide-react"

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
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    Label,
} from "@suiteonix/ui"

const benefits = [
    {
        icon: MailCheck,
        title: "Use the email you registered with",
        description: "Enter the customer account email address and the verification token sent by Suiteonix.",
    },
    {
        icon: KeyRound,
        title: "Confirm the one-time token",
        description: "The form submits directly to the customer verification endpoint and reports the result immediately.",
    },
    {
        icon: ShieldCheck,
        title: "Continue after activation",
        description: "Once verified, your customer account is ready for the standard portal sign-in flow.",
    },
]

type VerifyEmailFormValues = {
    email: string
    token: string
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

function validateToken(value: string) {
    if (!value.trim()) {
        return "Verification token is required"
    }

    if (!/^\d+$/.test(value.trim())) {
        return "Verification token must be numeric"
    }

    return undefined
}

export function CustomerVerifyEmailPage({
    initialEmail = "",
    initialToken = "",
    autosubmit = false,
}: {
    initialEmail?: string
    initialToken?: string
    autosubmit?: boolean
}) {
    const verifyEmail = CustomerRequest.useVerifyCustomerEmail()
    const autosubmitKeyRef = useRef<string | null>(null)

    const form = useForm({
        defaultValues: {
            email: initialEmail,
            token: initialToken,
        } satisfies VerifyEmailFormValues,
        onSubmit: async ({value}) => {
            await verifyEmail.mutateAsync({
                email: value.email.trim(),
                token: value.token.trim(),
            })
        },
    })

    useEffect(() => {
        form.setFieldValue("email", initialEmail)
        form.setFieldValue("token", initialToken)
    }, [form, initialEmail, initialToken])

    useEffect(() => {
        const email = initialEmail.trim()
        const token = initialToken.trim()
        const autosubmitKey = `${email}:${token}`

        if (!autosubmit || !email || !token || autosubmitKeyRef.current === autosubmitKey) {
            return
        }

        autosubmitKeyRef.current = autosubmitKey
        void form.handleSubmit()
    }, [autosubmit, form, initialEmail, initialToken])

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    return (
        <main className="page-wrap grid min-h-dvh gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="grid gap-6">
                <Badge variant="outline" className="w-fit">
                    Customer Activation
                </Badge>
                <div className="grid gap-4">
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        Verify your customer email.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-muted-foreground">
                        Complete account activation with the email address and token from your Suiteonix customer verification message.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline">
                            <Link to="/login" search={{email: form.state.values.email}}>
                                Back to login
                            </Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link to="/resend-verification-email" search={{email: form.state.values.email}}>
                                Resend verification email
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
                        <CardTitle className="text-2xl">
                            {verifyEmail.isSuccess ? (
                                <span className="text-success">Email verified</span>
                            ) : (
                                "Verify email"
                            )}
                        </CardTitle>
                        {!verifyEmail.isSuccess ? (
                            <CardDescription>
                                Submit the verification token from your email to activate the customer account.
                            </CardDescription>
                        ) : null}
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
                                            disabled={Boolean(initialEmail)}
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

                            {!verifyEmail.isSuccess ? (
                                <form.Field
                                    name="token"
                                    validators={{
                                        onChange: ({value}) => validateToken(value),
                                    }}
                                >
                                    {(field) => (
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>Verification token</Label>
                                            <InputOTP
                                                maxLength={6}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(value) => field.handleChange(value)}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0}/>
                                                    <InputOTPSlot index={1}/>
                                                    <InputOTPSlot index={2}/>
                                                    <InputOTPSlot index={3}/>
                                                    <InputOTPSlot index={4}/>
                                                    <InputOTPSlot index={5}/>
                                                </InputOTPGroup>
                                            </InputOTP>
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
                            ) : null}

                            {verifyEmail.isSuccess ? (
                                <Alert>
                                    <AlertTitle>Email verified</AlertTitle>
                                    <AlertDescription className="grid gap-4">
                                        <span>
                                            {verifyEmail.data?.message || "Your customer account is verified. You can sign in now."}
                                        </span>
                                        <div className="flex justify-end">
                                            <Button asChild variant="outline">
                                                <Link to="/login" search={{email: form.state.values.email}}>
                                                    Sign in
                                                </Link>
                                            </Button>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            {verifyEmail.isError ? (
                                <Alert variant="destructive">
                                    <AlertTitle>Verification failed</AlertTitle>
                                    <AlertDescription>
                                        {verifyEmail.error?.message || "We could not verify this email address."}
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            {!verifyEmail.isSuccess ? (
                                <Button type="submit" disabled={isSubmitting || verifyEmail.isPending}>
                                    {isSubmitting || verifyEmail.isPending ? "Verifying..." : "Verify email"}
                                </Button>
                            ) : null}
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
