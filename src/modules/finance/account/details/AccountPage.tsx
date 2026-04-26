import type {ReactNode} from "react"
import {useNavigate} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {ButtonGroup} from "#/components/ui/button-group.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "#/components/ui/tabs.tsx"
import {AccountRequest} from "#/modules/finance/account/request.hook.ts"
import {
  ACCOUNT_DETAILS_TABS,
  ACCOUNT_DETAILS_TAB_LABELS,
  ACCOUNT_DETAILS_TAB_TO,
  type AccountDetailsTab,
} from "#/modules/finance/account/details/account-details.constants.ts"
import {
  accountStatusBadgeVariant,
  getAccountDisplayName,
} from "#/modules/finance/finance.utils.tsx"
import {
  Route as AccountDetailsRoute,
} from "#/routes/_authenticated/admin/finance/accounts/$accountId/route.tsx"

type AccountPageProps = {
  activeTab: AccountDetailsTab
  children: ReactNode
}

const AccountPage = ({
  activeTab,
  children,
}: AccountPageProps) => {
  const navigate = useNavigate()
  const {accountId} = AccountDetailsRoute.useParams()
  const {data, isLoading, isFetching} = AccountRequest.useGetAccountDetailed(accountId)

  return (
    <Page
      isLoading={isLoading}
      isFetching={isFetching}
      loading={{
        title: "Loading",
        description: `Fetching account (${accountId})`,
      }}
      header={{
        title: getAccountDisplayName(data),
        description: data?.accountNumberMasked || data?.iban || "Finance account overview and activity",
        actionView: (
          <ButtonGroup>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back
            </Button>
          </ButtonGroup>
        ),
      }}
    >
      <Card className="min-h-full">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <CardTitle>{getAccountDisplayName(data)}</CardTitle>
              <CardDescription>
                Review the account profile, balance structure, and linked transactions.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {data?.status ? (
                <Badge variant={accountStatusBadgeVariant[data.status]}>
                  {data.status}
                </Badge>
              ) : null}
              <Badge variant="outline">{data?.type || "TYPE_UNSET"}</Badge>
              {data?.primaryAccount ? <Badge variant="success">Primary</Badge> : null}
              <Badge variant="outline">ID: {accountId}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              void navigate({
                to: ACCOUNT_DETAILS_TAB_TO[value as AccountDetailsTab] as any,
                params: {accountId} as any,
                replace: true,
              })
            }}
            className="gap-6"
          >
            <TabsList variant="line" className="h-auto w-full flex-wrap justify-start rounded-none p-0">
              {ACCOUNT_DETAILS_TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="flex-none px-1.5 py-2">
                  {ACCOUNT_DETAILS_TAB_LABELS[tab]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="mt-6">
            {children}
          </div>
        </CardContent>
      </Card>
    </Page>
  )
}

export default AccountPage
