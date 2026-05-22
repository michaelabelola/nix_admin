import {Spinner} from "#/components/ui/spinner.tsx"
import {AccountRequest} from "@suiteonix/server"
import {AccountModel} from "@suiteonix/server"
import {KeyValue, SectionCard} from "#/modules/finance/FinancePrimitives.tsx"
import {OrganizationRequest as organizationRequest} from "@suiteonix/server"
import {formatDateTime, formatMoney} from "#/modules/finance/finance.utils.tsx"

export function AccountDetailsInfoTab({account}: { account?: AccountModel.Detailed }) {
  const {data: accountRecord} = AccountRequest.useGetAccount(account?.id)
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
          <KeyValue label="Account Number" value={account?.accountNumber}/>
          <KeyValue label="Provider Account ID" value={accountRecord?.providerAccountId}/>
          <KeyValue label="Provider Customer ID" value={accountRecord?.providerCustomerId}/>
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
        title="Balance"
        description="Current balance snapshot attached to this account."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <KeyValue label="Currency" value={account?.balance?.currency}/>
          <KeyValue label="Current" value={formatMoney(account?.balance?.current)}/>
          <KeyValue label="Ledger" value={formatMoney(account?.balance?.ledger)}/>
        </div>
      </SectionCard>
    </div>
  )
}
