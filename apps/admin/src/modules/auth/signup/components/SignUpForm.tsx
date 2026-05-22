import {useMemo, useState} from 'react'
import {useForm, useStore} from '@tanstack/react-form'

import {Alert, AlertDescription, AlertTitle} from '@suiteonix/ui'
import {Button} from '@suiteonix/ui'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@suiteonix/ui'
import {DatePicker, parseDateInput, toDateInputValue} from '@suiteonix/ui'
import {Input} from '@suiteonix/ui'
import {Label} from '@suiteonix/ui'
import {Textarea} from '@suiteonix/ui'
import {CountryDropdown} from '#/modules/location/components/CountryDropdown.tsx'
import {PhoneNumberInput} from '#/modules/location/components/PhoneNumberInput.tsx'
import {StatesDropdown} from '#/modules/location/components/StatesDropdown.tsx'
import {SignupHook} from '@suiteonix/server'
import {useNavigate} from "@tanstack/react-router";

type SignUpFormValues = {
    firstname: string
    lastname: string
    email: string
    phone: string
    password: string
    dateOfBirth: string
    bio: string
    street: string
    aptNumber: string
    city: string
    state: string
    country: string
    zipcode: string
}

type FieldError = string | { message?: string }

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

function getErrorMessage(error: FieldError) {
    return typeof error === 'string' ? error : error.message ?? 'Invalid value'
}

function SignUpTextField({
                             field,
                             label,
                             placeholder,
                             type = 'text',
                             autoComplete
                         }: {
    field: any
    label: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'tel'
    autoComplete?: Parameters<typeof Input>[0]["autoComplete"]
}) {
    const errors = useStore(field.store, (state: any) => state.meta.errors as FieldError[])

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{label}</Label>
            <Input
                id={field.name}
                name={field.name}
                type={type}
                value={field.state.value}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                autoComplete={autoComplete}
                onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.isTouched && errors.length > 0 ? (
                <div className="space-y-1 text-sm text-destructive">
                    {errors.map((error) => {
                        const message = getErrorMessage(error)
                        return <small key={message}>{message}</small>
                    })}
                </div>
            ) : null}
        </div>
    )
}

function SignUpDateField({
                             field,
                             label,
                             placeholder,
                         }: {
    field: any
    label: string
    placeholder?: string
}) {
    const errors = useStore(field.store, (state: any) => state.meta.errors as FieldError[])
    const selectedDate = parseDateInput(field.state.value)
    const today = new Date()

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <DatePicker
                value={selectedDate}
                placeholder={placeholder}
                captionLayout="dropdown"
                startMonth={new Date(1900, 0, 1)}
                endMonth={today}
                disabled={(date) => date > today || date < new Date(1900, 0, 1)}
                onChange={(date) => {
                    if (!date) {
                        return
                    }

                    field.handleChange(toDateInputValue(date))
                }}
            />
            {field.state.meta.isTouched && errors.length > 0 ? (
                <div className="space-y-1 text-sm text-destructive">
                    {errors.map((error) => {
                        const message = getErrorMessage(error)
                        return <small key={message}>{message}</small>
                    })}
                </div>
            ) : null}
        </div>
    )
}

function SignUpPhoneField({
                              field,
                              label,
                              placeholder,
                          }: {
    field: any
    label: string
    placeholder?: string
}) {
    const errors = useStore(field.store, (state: any) => state.meta.errors as FieldError[])

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{label}</Label>
            <PhoneNumberInput
                id={field.name}
                name={field.name}
                value={field.state.value}
                placeholder={placeholder}
                onBlur={field.handleBlur}
                onValueChange={(value) => field.handleChange(value)}
            />
            {field.state.meta.isTouched && errors.length > 0 ? (
                <div className="space-y-1 text-sm text-destructive">
                    {errors.map((error) => {
                        const message = getErrorMessage(error)
                        return <small key={message}>{message}</small>
                    })}
                </div>
            ) : null}
        </div>
    )
}

function SignUpTextAreaField({
                                 field,
                                 label,
                                 placeholder,
                             }: {
    field: any
    label: string
    placeholder?: string
}) {
    const errors = useStore(field.store, (state: any) => state.meta.errors as FieldError[])

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{label}</Label>
            <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                placeholder={placeholder}
                className="min-h-24"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.isTouched && errors.length > 0 ? (
                <div className="space-y-1 text-sm text-destructive">
                    {errors.map((error) => {
                        const message = getErrorMessage(error)
                        return <small key={message}>{message}</small>
                    })}
                </div>
            ) : null}
        </div>
    )
}

function SignUpDropdownField({
                                 field,
                                 label,
                                 children,
                             }: {
    field: any
    label: string
    children: React.ReactNode
}) {
    const errors = useStore(field.store, (state: any) => state.meta.errors as FieldError[])

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{label}</Label>
            {children}
            {field.state.meta.isTouched && errors.length > 0 ? (
                <div className="space-y-1 text-sm text-destructive">
                    {errors.map((error) => {
                        const message = getErrorMessage(error)
                        return <small key={message}>{message}</small>
                    })}
                </div>
            ) : null}
        </div>
    )
}

export function SignUpForm() {
    const [avatar, setAvatar] = useState<File | undefined>()
    const [isRegistered, setIsRegistered] = useState(false)
    const signup = SignupHook.useSignUp(() => {
        setIsRegistered(true)
        setAvatar(undefined)
    })

    const fieldErrors = useMemo(() => {
        return Object.fromEntries(
            signup.errHandler.errors.map((entry) => {
                const [key, value] = Object.entries(entry)[0] ?? []
                return [key, value]
            }).filter(([key]) => Boolean(key)),
        ) as Record<string, string>
    }, [signup.errHandler.errors])
    const navigate = useNavigate()
    // @ts-ignore
    const form = useForm<SignUpFormValues>({
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            password: '',
            dateOfBirth: '',
            bio: '',
            street: '',
            aptNumber: '',
            city: '',
            state: '',
            country: '',
            zipcode: '',
        },
        onSubmit: async ({value}) => {
            setIsRegistered(false)
            await signup.mutateAsync({
                ...value,
                firstname: value.firstname.trim(),
                lastname: value.lastname.trim(),
                email: value.email.trim(),
                phone: value.phone.trim(),
                password: value.password,
                dateOfBirth: value.dateOfBirth,
                bio: value.bio.trim(),
                address: {
                    street: value.street.trim(),
                    apt_number: value.aptNumber.trim(),
                    city: value.city.trim(),
                    state: value.state.trim(),
                    country: value.country.trim(),
                    zipcode: value.zipcode.trim(),
                    latitude: 0,
                    longitude: 0,
                },
                avatar,
            }).then(value1 => {
                setTimeout(() => {
                    navigate({
                        to: '/verify-email',
                        search: {
                            email: value1.auth.email,
                            token: ''
                        } as any
                    })
                }, 2000)
            })
        },
    })

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Create account</CardTitle>
                <CardDescription>
                    Register a new Suiteonix user profile and onboard your account details in one step.
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
                    <div className="grid gap-5 sm:grid-cols-2">
                        <form.Field
                            name="firstname"
                            validators={{onChange: ({value}) => required(value, 'First name')}}
                        >
                            {(field) => (
                                <SignUpTextField autoComplete={"given-name"} field={field} label="First name"
                                                 placeholder="Ada"/>
                            )}
                        </form.Field>

                        <form.Field
                            name="lastname"
                            validators={{onChange: ({value}) => required(value, 'Last name')}}
                        >
                            {(field) => (
                                <SignUpTextField autoComplete={"family-name"} field={field} label="Last name"
                                                 placeholder="Lovelace"/>
                            )}
                        </form.Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <form.Field
                            name="email"
                            validators={{onChange: ({value}) => validateEmail(value)}}
                        >
                            {(field) => (
                                <SignUpTextField autoComplete={"email"} field={field} label="Email" type="email"
                                                 placeholder="you@company.com"/>
                            )}
                        </form.Field>

                        <form.Field
                            name="phone"
                            validators={{onChange: ({value}) => required(value, 'Phone')}}
                        >
                            {(field) => (
                                <SignUpPhoneField field={field} label="Phone" placeholder="555 010 1100"/>
                            )}
                        </form.Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <form.Field
                            name="password"
                            validators={{onChange: ({value}) => required(value, 'Password')}}
                        >
                            {(field) => (
                                <SignUpTextField field={field} label="Password" type="password"
                                                 placeholder="Create a password"/>
                            )}
                        </form.Field>

                        <form.Field
                            name="dateOfBirth"
                            validators={{onChange: ({value}) => required(value, 'Date of birth')}}
                        >
                            {(field) => (
                                <SignUpDateField
                                    field={field}
                                    label="Date of birth"
                                    placeholder="Select your date of birth"
                                />
                            )}
                        </form.Field>
                    </div>

                    <form.Field
                        name="bio"
                        validators={{onChange: ({value}) => required(value, 'Bio')}}
                    >
                        {(field) => (
                            <SignUpTextAreaField
                                field={field}
                                label="Bio"
                                placeholder="Briefly describe your role or responsibilities."
                            />
                        )}
                    </form.Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <form.Field
                            name="street"
                            validators={{onChange: ({value}) => required(value, 'Street')}}
                        >
                            {(field) => (
                                <SignUpTextField field={field} label="Street" placeholder="123 Main Street"/>
                            )}
                        </form.Field>

                        <form.Field
                            name="aptNumber"
                        >
                            {(field) => (
                                <SignUpTextField field={field} label="Apt / Suite" placeholder="Suite 400"/>
                            )}
                        </form.Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <form.Field
                            name="city"
                            validators={{onChange: ({value}) => required(value, 'City')}}
                        >
                            {(field) => (
                                <SignUpTextField field={field} label="City" placeholder="Toronto"/>
                            )}
                        </form.Field>

                        <form.Field
                            name="state"
                            validators={{onChange: ({value}) => required(value, 'State / Province')}}
                        >
                            {(field) => (
                                <SignUpDropdownField field={field} label="State / Province">
                                    <StatesDropdown
                                        name={field.name}
                                        value={field.state.value}
                                        countryIso2={form.getFieldValue('country')}
                                        placeholder="Select a state or province"
                                        onValueChange={(value) => field.handleChange(value)}
                                    />
                                </SignUpDropdownField>
                            )}
                        </form.Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <form.Field
                            name="country"
                            validators={{onChange: ({value}) => required(value, 'Country')}}
                        >
                            {(field) => (
                                <SignUpDropdownField field={field} label="Country">
                                    <CountryDropdown
                                        name={field.name}
                                        value={field.state.value}
                                        placeholder="Select a country"
                                        onValueChange={(value) => {
                                            field.handleChange(value)
                                            form.setFieldValue('state', '')
                                        }}
                                    />
                                </SignUpDropdownField>
                            )}
                        </form.Field>

                        <form.Field
                            name="zipcode"
                            validators={{onChange: ({value}) => required(value, 'Postal code')}}
                        >
                            {(field) => (
                                <SignUpTextField field={field} label="Postal code" placeholder="M5V 2T6"/>
                            )}
                        </form.Field>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="avatar">Avatar</Label>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                setAvatar(event.target.files?.[0])
                            }}
                        />
                    </div>

                    {Object.keys(fieldErrors).length > 0 ? (
                        <Alert variant="destructive">
                            <AlertTitle>Registration failed</AlertTitle>
                            <AlertDescription>
                                {fieldErrors.email
                                    || fieldErrors.phone
                                    || fieldErrors.password
                                    || fieldErrors.firstname
                                    || fieldErrors.lastname
                                    || signup.error?.message
                                    || 'We could not complete your registration.'}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    {signup.isError && Object.keys(fieldErrors).length === 0 ? (
                        <Alert variant="destructive">
                            <AlertTitle>Registration failed</AlertTitle>
                            <AlertDescription>
                                {signup.error?.message || 'We could not complete your registration.'}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    {isRegistered ? (
                        <Alert>
                            <AlertTitle>Account created</AlertTitle>
                            <AlertDescription>
                                Your registration was submitted successfully.
                                Check your email for verification Token
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <Button type="submit" variant={"default"} disabled={isSubmitting || signup.isPending}>
                        {isSubmitting || signup.isPending ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
