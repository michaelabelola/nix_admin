import {useState} from "react"
import {Link} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty.tsx"
import {cn} from "#/lib/utils.ts"
import {AccountModel} from "#/modules/finance/account/model.ts"

import {CreateAggregateAccountForm, CreateNixAccountForm} from "./AccountCreateForms.tsx"
import {
  CREATABLE_ACCOUNT_TYPES,
  type CreatableAccountType,
} from "./account-create.constants.ts"

function AccountTypeChooser({
  selectedType,
  onSelect,
}: {
  selectedType: CreatableAccountType | null
  onSelect: (type: CreatableAccountType) => void
}) {
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="space-y-1">
          <CardTitle>Hi.</CardTitle>
          <CardDescription>
            Choose the finance account type you want to create. Only `NIX` and `AGGREGATE` are available during creation for now.
          </CardDescription>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {CREATABLE_ACCOUNT_TYPES.map(({type, title, description, icon: Icon}) => {
            const isSelected = selectedType === type

            return (
              <button
                key={type}
                type="button"
                className={cn(
                  "rounded-xl border p-5 text-left transition hover:border-primary/60 hover:bg-muted/30",
                  isSelected && "border-primary bg-primary/5",
                )}
                onClick={() => onSelect(type)}
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
              </button>
            )
          })}
        </div>
      </CardHeader>
    </Card>
  )
}

function AccountCreateState({selectedType}: { selectedType: CreatableAccountType | null }) {
  if (!selectedType) {
    return (
      <Empty className="min-h-72 border">
        <EmptyHeader>
          <EmptyMedia variant="icon"/>
          <EmptyTitle>Select an account type</EmptyTitle>
          <EmptyDescription>
            Start with the account category, then the matching create form will appear below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <p>Available now: `NIX` and `AGGREGATE`.</p>
        </EmptyContent>
      </Empty>
    )
  }

  if (selectedType === AccountModel.AccountType.NIX) {
    return <CreateNixAccountForm/>
  }

  return <CreateAggregateAccountForm/>
}

export function AccountCreatePage() {
  const [selectedType, setSelectedType] = useState<CreatableAccountType | null>(null)

  return (
    <Page
      header={{
        title: "Create Account",
        description: "Pick an account type first, then complete the matching finance setup form.",
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
        <AccountTypeChooser selectedType={selectedType} onSelect={setSelectedType}/>
        <AccountCreateState selectedType={selectedType}/>
      </div>
    </Page>
  )
}
