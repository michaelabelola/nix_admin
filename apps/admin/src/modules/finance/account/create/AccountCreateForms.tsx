import {useMemo, useState} from "react"
import {Link, useNavigate} from "@tanstack/react-router"
import {toast} from "sonner"

import {Badge} from "@suiteonix/ui"
import {Button} from "@suiteonix/ui"
import {ButtonGroup} from "@suiteonix/ui"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@suiteonix/ui"
import {Checkbox} from "@suiteonix/ui"
import {Label} from "@suiteonix/ui"
import {AccountModel} from "@suiteonix/server"
import {AccountRequest} from "@suiteonix/server"
import {getAccountDisplayName} from "#/modules/finance/finance.utils.tsx"

import type {CreatableAccountType} from "./account-create.constants.ts"
import {
    AccountCreateCheckboxField,
    AccountCreateSelectField,
    AccountCreateServerErrors,
    AccountCreateTextareaField,
    AccountCreateTextField,
} from "./account-create.fields.tsx"
import {cn} from "#/lib/utils.ts";

type BaseAccountFormValues = {
    name: string
    description: string
    primaryAccount: boolean
    currencyCode: string
}

type AggregateAccountFormValues = BaseAccountFormValues & {
    memberAccounts: string[]
}

type FormErrors = Partial<Record<keyof AggregateAccountFormValues, string>>

const BASE_DEFAULTS: BaseAccountFormValues = {
    name: "",
    description: "",
    primaryAccount: false,
    currencyCode: "",
}

const AGGREGATE_DEFAULTS: AggregateAccountFormValues = {
    ...BASE_DEFAULTS,
    memberAccounts: [],
}

function getCurrencyOptions(currencies: AccountModel.SupportedCurrency[]) {
    const currencyMap = new Map<string, { label: string; value: string }>()

    currencies.forEach((currency) => {
        if (currencyMap.has(currency.currency)) return
        currencyMap.set(currency.currency, {
            label: `${currency.symbol} ${currency.currency} - ${currency.name}`,
            value: currency.currency,
        })
    })

    return [...currencyMap.values()].sort((left, right) => left.value.localeCompare(right.value))
}

function validateBaseValues(values: BaseAccountFormValues): FormErrors {
    const errors: FormErrors = {}

    if (!values.name.trim()) {
        errors.name = "Account name is required."
    }

    if (!values.currencyCode.trim()) {
        errors.currencyCode = "Currency is required."
    }

    return errors
}

function hasFormErrors(errors: FormErrors) {
    return Object.keys(errors).length > 0
}

function normalizeDescription(value: string) {
    const normalized = value.trim()
    return normalized || undefined
}

function CommonAccountFields({
                                 values,
                                 errors,
                                 currencyOptions,
                                 currenciesLoading,
                                 accountType,
                                 onFieldChange,
                             }: {
    values: BaseAccountFormValues
    errors: FormErrors
    currencyOptions: Array<{ label: string; value: string }>
    currenciesLoading: boolean
    accountType: CreatableAccountType
    onFieldChange: (field: keyof BaseAccountFormValues, value: string | boolean) => void
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
                <AccountCreateTextField
                    id="account-name"
                    label="Account name"
                    value={values.name}
                    placeholder="Operating account"
                    error={errors.name}
                    onChange={(value) => onFieldChange("name", value)}
                />
            </div>

            <div className="md:col-span-2">
                <AccountCreateTextareaField
                    id="account-description"
                    label="Description"
                    value={values.description}
                    placeholder="Describe how this account should be used."
                    description="Optional, but useful when multiple teams manage finance accounts."
                    onChange={(value) => onFieldChange("description", value)}
                />
            </div>

            <AccountCreateSelectField
                id="account-currency"
                label="Currency"
                value={values.currencyCode}
                options={currencyOptions}
                placeholder={currenciesLoading ? "Loading currencies..." : "Select a currency"}
                emptyLabel="No supported currencies available"
                error={errors.currencyCode}
                disabled={currenciesLoading}
                onChange={(value) => onFieldChange("currencyCode", value)}
            />

            <div className="grid gap-2">
                <Label>Account type</Label>
                <div className="rounded-lg border bg-muted/30 px-4 py-3">
                    <Badge variant="outline">{accountType}</Badge>
                </div>
            </div>

            <div className="md:col-span-2">
                <AccountCreateCheckboxField
                    id="account-primary"
                    label="Mark as primary account"
                    description="Primary accounts are treated as the main settlement or operating account in the finance workspace."
                    checked={values.primaryAccount}
                    onCheckedChange={(checked) => onFieldChange("primaryAccount", checked)}
                />
            </div>
        </div>
    )
}

function FormShell({
                       title,
                       description,
                       children,
                       isSubmitting,
                       serverErrors,
                   }: {
    title: string
    description: string
    children: React.ReactNode
    isSubmitting: boolean
    serverErrors: Array<Record<string, string>>
}) {
    return (
        <Card>
            <CardHeader className="gap-3">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <AccountCreateServerErrors errors={serverErrors}/>
            </CardHeader>
            <CardContent className="space-y-6">
                {children}
                <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Review the account type carefully before submitting. Only `NIX` and `AGGREGATE` are enabled
                        right now.
                    </p>
                    <ButtonGroup>
                        <Button variant="outline" asChild className={cn(
                            // "border-t-destructive! border-b-destructive! border-l-destructive! text-destructive! border-r-transparent!",
                            "text-destructive hover:bg-destructive! hover:text-destructive-foreground! hover:border-destructive!"
                        )}>
                            <Link to="/admin/finance/accounts/create" className={""}>Cancel</Link>
                        </Button>
                        <Button type="submit" variant={"outline"} className={"border-l-transparent!"}
                                disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create account"}
                        </Button>
                    </ButtonGroup>
                </div>
            </CardContent>
        </Card>
    )
}

export function CreateNixAccountForm() {
    const navigate = useNavigate()
    const [values, setValues] = useState<BaseAccountFormValues>(BASE_DEFAULTS)
    const [errors, setErrors] = useState<FormErrors>({})
    const supportedCurrenciesQuery = AccountRequest.useGetSupportedCurrencies(AccountModel.AccountType.NIX)
    const createNixAccount = AccountRequest.useCreateNixAccount((account) => {
        toast.success("NIX account created.")
        void navigate({
            to: "/admin/finance/accounts/$accountId/dashboard",
            params: {accountId: account.id},
        })
    })

    const currencyOptions = useMemo(
        () => getCurrencyOptions(supportedCurrenciesQuery.data ?? []),
        [supportedCurrenciesQuery.data],
    )

    const handleFieldChange = (field: keyof BaseAccountFormValues, value: string | boolean) => {
        setValues((current) => ({...current, [field]: value}))
        setErrors((current) => {
            if (!current[field]) return current
            const next = {...current}
            delete next[field]
            return next
        })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextErrors = validateBaseValues(values)
        setErrors(nextErrors)
        if (hasFormErrors(nextErrors)) return

        await createNixAccount.mutateAsync({
            name: values.name.trim(),
            description: normalizeDescription(values.description),
            primaryAccount: values.primaryAccount || undefined,
            currencyCode: values.currencyCode,
        })
    }

    return (
        <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
            <FormShell
                title="Create NIX account"
                description="Set up a native account that can directly hold balances and ledger activity."
                isSubmitting={createNixAccount.isPending}
                serverErrors={createNixAccount.errHandler.errors}
            >
                <CommonAccountFields
                    values={values}
                    errors={errors}
                    currencyOptions={currencyOptions}
                    currenciesLoading={supportedCurrenciesQuery.isLoading}
                    accountType={AccountModel.AccountType.NIX}
                    onFieldChange={handleFieldChange}
                />
            </FormShell>
        </form>
    )
}

function AggregateMemberAccountsField({
                                          accountIds,
                                          availableAccounts,
                                          error,
                                          onToggle,
                                      }: {
    accountIds: string[]
    availableAccounts: AccountModel.Account[]
    error?: string
    onToggle: (accountId: string) => void
}) {
    return (
        <div className="grid gap-3">
            <div className="space-y-1">
                <Label>Member accounts</Label>
                <p className="text-sm text-muted-foreground">
                    Optional. Add the accounts this aggregate should summarize.
                </p>
            </div>

            {availableAccounts.length ? (
                <div className="grid gap-3 rounded-lg border p-4">
                    {availableAccounts.map((account) => {
                        const checked = accountIds.includes(account.id)

                        return (
                            <label key={account.id} htmlFor={`member-account-${account.id}`}
                                   className="flex items-start gap-3 rounded-lg border p-3">
                                <Checkbox
                                    id={`member-account-${account.id}`}
                                    checked={checked}
                                    onCheckedChange={() => onToggle(account.id)}
                                />
                                <span className="space-y-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="block text-sm font-medium">{getAccountDisplayName(account)}</span>
                      {account.type ? <Badge variant="outline">{account.type}</Badge> : null}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {account.accountNumber || account.id}
                  </span>
                </span>
                            </label>
                        )
                    })}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    No existing accounts are available yet. You can still create the aggregate account now and attach
                    member accounts later.
                </div>
            )}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    )
}

export function CreateAggregateAccountForm() {
    const navigate = useNavigate()
    const [values, setValues] = useState<AggregateAccountFormValues>(AGGREGATE_DEFAULTS)
    const [errors, setErrors] = useState<FormErrors>({})
    const supportedCurrenciesQuery = AccountRequest.useGetSupportedCurrencies(AccountModel.AccountType.AGGREGATE)
    const memberAccountsQuery = AccountRequest.useQueryAccounts({
        page: 0,
        size: 100,
        sort: [{field: "name", direction: "ASC"}],
    })
    const createAggregateAccount = AccountRequest.useCreateAggregateAccount((account) => {
        toast.success("Aggregate account created.")
        void navigate({
            to: "/admin/finance/accounts/$accountId/dashboard",
            params: {accountId: account.id},
        })
    })

    const currencyOptions = useMemo(
        () => getCurrencyOptions(supportedCurrenciesQuery.data ?? []),
        [supportedCurrenciesQuery.data],
    )

    const availableAccounts = useMemo(
        () => (memberAccountsQuery.data?.content ?? []).filter((account) => account.id),
        [memberAccountsQuery.data?.content],
    )

    const handleFieldChange = (field: keyof BaseAccountFormValues, value: string | boolean) => {
        setValues((current) => ({...current, [field]: value}))
        setErrors((current) => {
            if (!current[field]) return current
            const next = {...current}
            delete next[field]
            return next
        })
    }

    const toggleMemberAccount = (accountId: string) => {
        setValues((current) => {
            const memberAccounts = current.memberAccounts.includes(accountId)
                ? current.memberAccounts.filter((value) => value !== accountId)
                : [...current.memberAccounts, accountId]

            return {...current, memberAccounts}
        })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextErrors = validateBaseValues(values)
        setErrors(nextErrors)
        if (hasFormErrors(nextErrors)) return

        await createAggregateAccount.mutateAsync({
            name: values.name.trim(),
            description: normalizeDescription(values.description),
            primaryAccount: values.primaryAccount || undefined,
            currencyCode: values.currencyCode,
            memberAccounts: values.memberAccounts,
        })
    }

    return (
        <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
            <FormShell
                title="Create aggregate account"
                description="Set up an aggregate account and optionally attach member accounts now."
                isSubmitting={createAggregateAccount.isPending}
                serverErrors={createAggregateAccount.errHandler.errors}
            >
                <CommonAccountFields
                    values={values}
                    errors={errors}
                    currencyOptions={currencyOptions}
                    currenciesLoading={supportedCurrenciesQuery.isLoading}
                    accountType={AccountModel.AccountType.AGGREGATE}
                    onFieldChange={handleFieldChange}
                />

                <AggregateMemberAccountsField
                    accountIds={values.memberAccounts}
                    availableAccounts={availableAccounts}
                    error={errors.memberAccounts}
                    onToggle={toggleMemberAccount}
                />
            </FormShell>
        </form>
    )
}
