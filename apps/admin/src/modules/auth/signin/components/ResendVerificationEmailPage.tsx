import {Link} from '@tanstack/react-router'
import {MailCheck, RefreshCw, ShieldAlert} from 'lucide-react'
import {useEffect} from 'react'
import {useForm, useStore} from '@tanstack/react-form'

import {Alert, AlertDescription, AlertTitle} from '#/components/ui/alert.tsx'
import {Badge} from '#/components/ui/badge.tsx'
import {Button} from '#/components/ui/button.tsx'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '#/components/ui/card.tsx'
import {Input} from '#/components/ui/input.tsx'
import {Label} from '#/components/ui/label.tsx'
import {useEntityStore} from '#/lib/entity.store.ts'
import {SignInHook} from '@suiteonix/server'

const benefits = [
    {
        icon: MailCheck,
        title: 'Request a fresh verification email',
        description: 'Send another verification link or code when the original message expired or never arrived.',
    },
    {
        icon: ShieldAlert,
        title: 'Keep the correct organization context',
        description: 'If your workspace is entity-scoped, the page carries the current organization ID into the request.',
    },
    {
        icon: RefreshCw,
        title: 'Move back into sign in quickly',
        description: 'Once the message is sent, you can verify the account and return to login without leaving the auth flow.',
    },
]

type ResendVerificationFormValues = {
    email: string
    orgID: string
}

function required(value: string, label: string) {
    if (!value.trim()) {
        return `${label} is required`
    }

    return undefined
}

function validateEmail(value: string) {
    if (!value.trim()) {
        return 'Email is required'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Enter a valid email address'
    }

    return undefined
}

export function ResendVerificationEmailPage({initialEmail = ''}: { initialEmail?: string }) {
    const entityID = useEntityStore((state) => state.entityID)
    const resendVerification = SignInHook.useResendVerificationEmail()

    // @ts-ignore
    const form = useForm<ResendVerificationFormValues>({
        defaultValues: {
            email: initialEmail,
            orgID: entityID ?? '',
        },
        onSubmit: async ({value}) => {
            await resendVerification.mutateAsync({
                email: value.email.trim(),
                orgID: value.orgID.trim() || undefined,
            })
        },
    })

    useEffect(() => {
        if (entityID) {
            form.setFieldValue('orgID', entityID)
        }
    }, [entityID, form])

    useEffect(() => {
        form.setFieldValue('email', initialEmail)
    }, [form, initialEmail])

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    return (
        <main
            className="page-wrap grid min-h-[calc(100vh-4rem)] gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="grid gap-6">
                <Badge variant="outline" className="w-fit">
                    Email Verification
                </Badge>
                <div className="grid gap-4">
                    <h1 className="font-['Fraunces',serif] text-4xl font-bold tracking-tight sm:text-5xl">
                        Resend your verification email.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-muted-foreground">
                        Submit the email address tied to your Suiteonix account and request a new verification message.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline">
                            <Link to="/login" search={{email: ""}}>Back to login</Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link to="/verify-email" search={{
                                email: "", token: ""
                            }}>Already have a code?</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="grid gap-2 rounded-md border bg-card p-4">
                            <div className="flex items-center gap-3">
                                <span
                                    className="flex size-10 items-center justify-center rounded-md border bg-muted text-primary">
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
                            Request another email so you can complete account verification.
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
                            {Boolean(entityID) ? (
                                <form.Field
                                    name="orgID"
                                    validators={{
                                        onChange: ({value}) => required(value, 'Organization ID'),
                                    }}
                                >
                                    {(field) => (
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>Organization ID</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                disabled
                                                onBlur={field.handleBlur}
                                                onChange={(event) => field.handleChange(event.target.value)}
                                            />
                                        </div>
                                    )}
                                </form.Field>
                            ) : null}

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
                                            placeholder="you@company.com"
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
                                    <AlertDescription>
                                        Check your inbox and use the verification details in that message to activate
                                        the account.
                                        <Button>
                                            <Link to={"/verify-email"} search={{
                                                email: form?.state?.values?.email,
                                                token: ""
                                            }}>Continue</Link>
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            {resendVerification.isError ? (
                                <Alert variant="destructive">
                                    <AlertTitle>Request failed</AlertTitle>
                                    <AlertDescription>
                                        {resendVerification.error?.message || 'We could not resend the verification email.'}
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            <Button type="submit" disabled={isSubmitting || resendVerification.isPending}>
                                {isSubmitting || resendVerification.isPending ? 'Sending...' : 'Resend verification email'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
