import {Spinner} from "#/components/ui/spinner.tsx"
import {AccountModel} from "#/modules/finance/account/model.ts"
import {KeyValue, SectionCard} from "#/modules/finance/FinancePrimitives.tsx"
import organizationRequest from "#/modules/organization/organization.request.ts"
import {formatDateTime, formatMoney} from "#/modules/finance/finance.utils.tsx"

export function AccountDetailsInfoTab({account}: { account?: AccountModel.Detailed }) {
  const {data: org, isLoading: isLoadingOrg} = organizationRequest.useGetOrganizationByID(account?.entityID)

  return (
    <div className="space-y-4">
      <SectionCard
        title="Account Record"
        description="Core fields and linked provider metadata saved on the account."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <KeyValue label="Account ID" value={account?.id}/>
          <KeyValue label="Name" value={account?.name}/>
          <KeyValue label="Type" value={account?.type}/>
          <KeyValue label="Status" value={account?.status}/>
          <KeyValue label="Primary" value={account?.primaryAccount ? "Yes" : "No"}/>
          <KeyValue label="Account Number" value={account?.accountNumberMasked}/>
          <KeyValue label="IBAN" value={account?.iban}/>
          <KeyValue label="Routing Number" value={account?.routingNumber}/>
          <KeyValue label="Provider Account ID" value={account?.providerAccountId}/>
          <KeyValue label="Provider Customer ID" value={account?.providerCustomerId}/>
          <KeyValue
            label="Organization"
            value={isLoadingOrg ? <Spinner className="size-4"/> : org?.shortName || org?.name || account?.entityID}
          />
          <KeyValue label="Created" value={formatDateTime(account?.audit?.createdDate)}/>
          <KeyValue label="Modified" value={formatDateTime(account?.audit?.modifiedDate)}/>
          <KeyValue label="Description" value={account?.description}/>
        </div>
      </SectionCard>

      <SectionCard
        title="Balances"
        description="Per-currency balances currently attached to this account."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {(account?.balances ?? []).map((balance) => (
            <div key={balance.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{balance.currencyCode || "Currency unset"}</div>
                  <div className="text-sm text-muted-foreground">Balance ID: {balance.id}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {balance.primaryBalance ? "Primary balance" : "Secondary balance"}
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <KeyValue label="Available" value={formatMoney(balance.availableBalance)}/>
                <KeyValue label="Ledger" value={formatMoney(balance.ledgerBalance)}/>
                <KeyValue label="Reserved" value={formatMoney(balance.reservedBalance)}/>
                <KeyValue label="Last Synced" value={formatDateTime(balance.lastSyncedAt)}/>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
