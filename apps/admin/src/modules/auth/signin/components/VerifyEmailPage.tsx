import {Link} from '@tanstack/react-router'
import {KeyRound, MailCheck, ShieldCheck} from 'lucide-react'
import {useEffect, useRef} from 'react'
import {useForm, useStore} from '@tanstack/react-form'

import {Alert, AlertDescription, AlertTitle} from '#/components/ui/alert.tsx'
import {Badge} from '#/components/ui/badge.tsx'
import {Button} from '#/components/ui/button.tsx'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '#/components/ui/card.tsx'
import {Input} from '#/components/ui/input.tsx'
import {Label} from '#/components/ui/label.tsx'
import {SignInHook} from '@suiteonix/server'
import {InputOTP, InputOTPGroup, InputOTPSlot} from "#/components/ui/input-otp.tsx";

const benefits = [
    {
        icon: MailCheck,
        title: 'Verify from the email you received',
        description: 'Enter the email address and verification token from Suiteonix to confirm account ownership.',
    },
    {
        icon: KeyRound,
        title: 'Token-based activation',
        description: 'The page uses the backend verification endpoint directly and reports success or failure immediately.',
    },
    {
        icon: ShieldCheck,
        title: 'Return to login once confirmed',
        description: 'After a successful verification, the account is ready for the normal sign-in flow.',
    },
]

type VerifyEmailFormValues = {
    email: string
    token: string
    orgID: string
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

function validateToken(value: string) {
    if (!value.trim()) {
        return 'Verification token is required'
    }

    if (!/^\d+$/.test(value.trim())) {
        return 'Verification token must be numeric'
    }

    return undefined
}

export function VerifyEmailPage({
                                    initialEmail = '',
                                    initialToken = '',
                                    autosubmit = false,
                                }: {
    initialEmail?: string
    initialToken?: string
    autosubmit?: boolean
}) {
    // const entityID = useEntityStore((state) => state.entityID)
    const verifyEmail = SignInHook.useVerifyEmail()
    const autosubmitKeyRef = useRef<string | null>(null)

    // @ts-ignore
    const form = useForm<VerifyEmailFormValues>({
        defaultValues: {
            email: initialEmail,
            token: initialToken,
            orgID: undefined,
        },
        onSubmit: async ({value}) => {
            await verifyEmail.mutateAsync({
                email: value.email.trim(),
                token: Number(value.token.trim()),
                orgID: value.orgID ? value.orgID.trim() : undefined,
            })
        },
    })

    useEffect(() => {
        form.setFieldValue('email', initialEmail)
        form.setFieldValue('token', initialToken)
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
        <main
            className="page-wrap grid min-h-[calc(100vh-4rem)] gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="grid gap-6">
                <Badge variant="outline" className="w-fit">
                    Account Activation
                </Badge>
                <div className="grid gap-4">
                    <h1 className="font-['Fraunces',serif] text-4xl font-bold tracking-tight sm:text-5xl">
                        Verify your email address.
                    </h1>
                    <p className="max-w-xl text-base leading-8 text-muted-foreground">
                        Complete email verification with the address and token supplied by your Suiteonix verification
                        message.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline">
                            <Link to="/login" search={{email: form.state.values.email}}>Back to login</Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link to="/resend-verification-email" search={{email: form.state.values.email}}>Resend
                                Verification
                                Mail</Link>
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
                        <CardTitle className="text-2xl">
                            {!verifyEmail.isSuccess ? "Verify email" :
                                <span className={"text-success"}>Email Verified Successfully !!!</span>}
                        </CardTitle>
                        {!verifyEmail.isSuccess &&
                            < CardDescription>
                                Submit the verification token from your email to activate the account.
                            </CardDescription>
                        }
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
                            {/*<form.Field*/}
                            {/*    name="orgID"*/}
                            {/*    validators={{*/}
                            {/*        onChange: ({value}) => required(value, 'Organization ID'),*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    {(field) => (*/}
                            {/*        <div className="grid gap-2">*/}
                            {/*            <Label htmlFor={field.name}>Organization ID</Label>*/}
                            {/*            <Input*/}
                            {/*                id={field.name}*/}
                            {/*                name={field.name}*/}
                            {/*                value={field.state.value}*/}
                            {/*                disabled*/}
                            {/*                onBlur={field.handleBlur}*/}
                            {/*                onChange={(event) => field.handleChange(event.target.value)}*/}
                            {/*            />*/}
                            {/*        </div>*/}
                            {/*    )}*/}
                            {/*</form.Field>                           */}

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
                                            disabled={!!initialEmail}
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
                            {
                                !verifyEmail.isSuccess &&

                                <form.Field
                                    name="token"
                                    validators={{
                                        onChange: ({value}) => validateToken(value),
                                    }}
                                >
                                    {(field) => (
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>Verification token</Label>
                                            <InputOTP maxLength={6}
                                                      value={field.state.value}
                                                      onBlur={field.handleBlur}
                                                      onChange={(event) => field.handleChange(event)}
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

                                            {/*<Input*/}
                                            {/*    id={field.name}*/}
                                            {/*    name={field.name}*/}
                                            {/*    inputMode="numeric"*/}
                                            {/*    value={field.state.value}*/}
                                            {/*    placeholder="Enter the token from your email"*/}
                                            {/*    onBlur={field.handleBlur}*/}
                                            {/*    onChange={(event) => field.handleChange(event.target.value)}*/}
                                            {/*/>*/}
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
                            }

                            {verifyEmail.isSuccess ? (
                                <Alert>
                                    <AlertTitle>Email verified</AlertTitle>
                                    <AlertDescription>
                                        {verifyEmail.data?.message || 'Your account is verified. You can sign in now.'}
                                        <div className={"flex w-full justify-end gap-3"}>
                                            <Button variant={"outline"}>
                                                <Link to={"/login"} search={{email: form?.state?.values?.email}}>
                                                    Sign In
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
                                        {verifyEmail.error?.message || 'We could not verify this email address.'}
                                    </AlertDescription>
                                </Alert>
                            ) : null}
                            {!verifyEmail.isSuccess &&
                                <Button type="submit" disabled={isSubmitting || verifyEmail.isPending}>
                                    {isSubmitting || verifyEmail.isPending ? 'Verifying...' : 'Verify email'}
                                </Button>}
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
