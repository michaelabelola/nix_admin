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
import {CustomerRequest} from "#/modules/customer/request.hook.ts"
import {
    CUSTOMER_DETAILS_TABS,
    CUSTOMER_DETAILS_TAB_LABELS,
    CUSTOMER_DETAILS_TAB_TO,
    type CustomerDetailsTab,
} from "#/modules/customer/details/customer-details.constants.ts"
import {
    customerStatusBadgeVariant,
    getCustomerAvatarUrl,
    getCustomerDisplayName,
} from "#/modules/customer/details/customer-details.utils.ts"
import {
    Route as CustomerDetailsRoute,
} from "#/routes/_authenticated/admin/customers/$customerId/route.tsx"

type CustomerDetailsPageProps = {
    activeTab: CustomerDetailsTab
    children: ReactNode
}

const CustomerPage = ({
    activeTab,
    children,
}: CustomerDetailsPageProps) => {
    const navigate = useNavigate()
    const {customerId} = CustomerDetailsRoute.useParams()
    const {data, isLoading, isFetching} = CustomerRequest.useGetCustomerDetailed(customerId)

    return (
        <Page
            isLoading={isLoading}
            isFetching={isFetching}
            loading={{
                title: "Loading",
                description: `Fetching customer (${customerId})`,
            }}
            header={{
                avatar: getCustomerAvatarUrl(data?.avatar),
                title: getCustomerDisplayName(data),
                description: data?.customerNumber
                    ? `Customer #${data.customerNumber}`
                    : "Customer overview and relationship details",
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
                            <CardTitle>{getCustomerDisplayName(data)}</CardTitle>
                            <CardDescription>
                                Review customer status, profile details, contact information, and assigned tags.
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {data?.status ? (
                                <Badge variant={customerStatusBadgeVariant[data.status]}>
                                    {data.status}
                                </Badge>
                            ) : null}
                            <Badge variant="outline">{data?.type || "TYPE_UNSET"}</Badge>
                            <Badge variant="outline">{data?.lifecycleStage || "STAGE_UNSET"}</Badge>
                            <Badge variant="outline">ID: {customerId}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => {
                            void navigate({
                                to: CUSTOMER_DETAILS_TAB_TO[value as CustomerDetailsTab] as any,
                                params: {customerId} as any,
                                replace: true,
                            })
                        }}
                        className="gap-6"
                    >
                        <TabsList variant="line" className="h-auto w-full flex-wrap justify-start rounded-none p-0">
                            {CUSTOMER_DETAILS_TABS.map((tab) => (
                                <TabsTrigger key={tab} value={tab} className="flex-none px-1.5 py-2">
                                    {CUSTOMER_DETAILS_TAB_LABELS[tab]}
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

export default CustomerPage
