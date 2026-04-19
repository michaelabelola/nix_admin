import {useEffect} from 'react'
import {useForm, useStore} from '@tanstack/react-form'

import {Alert, AlertDescription, AlertTitle} from '#/components/ui/alert'
import {Button} from '#/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '#/components/ui/card'
import {useAuthenticatedUserStore} from '#/lib/authenticated-user.store'
import {useEntityStore} from '#/lib/entity.store'
import type {LoginModel} from '#/modules/auth/signin/Model.ts'
import {SignInHook} from '#/modules/auth/signin/request.hook'

import {SignInField} from './SignInField'
import {useNavigate} from "@tanstack/react-router";

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

export function SignInForm({initialEmail}: { initialEmail?: string }) {
    const navigate = useNavigate()
    const entityID = useEntityStore((state) => state.entityID)
    const setAuthenticatedUser = useAuthenticatedUserStore((state) => state.setAuthenticatedUser)

    const {errHandler, ...login} = SignInHook.useSignIn(async (response) => {

        setAuthenticatedUser(response)
        if (response.orgID)
            navigate({
                to: "/admin"
            })
        else navigate({
            to: "/self/organizations"
        })
    })

    // @ts-ignore
    const form = useForm<LoginModel.EmailAndPassword>({
        defaultValues: {
            email: initialEmail || '',
            password: '',
            orgID: entityID ?? '',
        },
        onSubmit: async ({value}) => {
            await login.mutateAsync({
                ...value,
                orgID: value.orgID?.trim() || undefined,
            })
        },
    })

    useEffect(() => {
        if (entityID) {
            form.setFieldValue('orgID', entityID)
        }
    }, [entityID, form])

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Sign in with your email and password to access your Suiteonix workspace.
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
                    {Boolean(entityID) &&
                        <form.Field
                            name="orgID"
                            validators={{
                                onChange: ({value}) => required(value ?? '', 'Organization ID'),
                            }}
                        >
                            {(field) => (
                                <SignInField
                                    field={field as any}
                                    label="Organization ID"
                                    placeholder="Enter your organization ID"
                                    disabled={Boolean(entityID)}
                                />
                            )}
                        </form.Field>
                    }
                    <form.Field
                        name="email"
                        validators={{
                            onChange: ({value}) => validateEmail(value),
                        }}
                    >
                        {(field) => (
                            <SignInField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="you@company.com"
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="password"
                        validators={{
                            onChange: ({value}) => required(value, 'Password'),
                        }}
                    >
                        {(field) => (
                            <SignInField
                                field={field}
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                            />
                        )}
                    </form.Field>

                    {login.isError ? (
                        <Alert variant="destructive">
                            <AlertTitle>Login failed</AlertTitle>
                            <AlertDescription>
                                {login.error?.message || 'We could not sign you in with those credentials.'}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <Button type="submit" disabled={isSubmitting || login.isPending}>
                        {isSubmitting || login.isPending ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
