import type {ReactNode} from "react"
import {Link} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import {cn} from "#/lib/utils.ts"
import {AccountModel} from "#/modules/finance/account/model.ts"

import {CreateAggregateAccountForm, CreateNixAccountForm} from "./AccountCreateForms.tsx"
import {CREATABLE_ACCOUNT_TYPES} from "./account-create.constants.ts"

const ACCOUNT_CREATE_ROUTES = {
  [AccountModel.AccountType.NIX]: "/admin/finance/accounts/create/nix",
  [AccountModel.AccountType.AGGREGATE]: "/admin/finance/accounts/create/aggregate",
} as const

function AccountTypeChooser() {
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="space-y-1">
          <CardTitle>Choose an account type</CardTitle>
          <CardDescription>
            Start from a dedicated page for the finance account you want to create. Only `NIX` and `AGGREGATE`
            are available during creation for now.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">
        {CREATABLE_ACCOUNT_TYPES.map(({type, title, description, icon: Icon}) => (
          <Link
            key={type}
            to={ACCOUNT_CREATE_ROUTES[type]}
            className={cn(
              "rounded-xl border p-5 text-left transition hover:border-primary/60 hover:bg-muted/30",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]",
            )}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-lg border p-2 text-muted-foreground">
                  <Icon className="size-5"/>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {type}
                </span>
              </div>
              <div className="space-y-1">
                <div className="font-medium">{title}</div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

function AccountCreateLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Page
      header={{
        title,
        description,
        actionView: (
          <ButtonGroup>
            <Button variant="outline" asChild>
              <Link to="/admin/finance/accounts/create">Account types</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/finance/accounts">Back to accounts</Link>
            </Button>
          </ButtonGroup>
        ),
      }}
    >
      <div className="grid gap-6">{children}</div>
    </Page>
  )
}

export function AccountCreateStartPage() {
  return (
    <Page
      header={{
        title: "Create Account",
        description: "Choose the finance account type first, then continue on its dedicated setup page.",
        actionView: (
          <ButtonGroup>
            <Button variant="outline" asChild>
              <Link to="/admin/finance/accounts">Back to accounts</Link>
            </Button>
          </ButtonGroup>
        ),
      }}
    >
      <div className="grid gap-6">
        <AccountTypeChooser/>
      </div>
    </Page>
  )
}

export function NixAccountCreatePage() {
  return (
    <AccountCreateLayout
      title="Create NIX Account"
      description="Set up a native finance account on its own page without the aggregate account form mixed in."
    >
      <CreateNixAccountForm/>
    </AccountCreateLayout>
  )
}

export function AggregateAccountCreatePage() {
  return (
    <AccountCreateLayout
      title="Create Aggregate Account"
      description="Set up an aggregate finance account on its own page and optionally attach member accounts."
    >
      <CreateAggregateAccountForm/>
    </AccountCreateLayout>
  )
}
