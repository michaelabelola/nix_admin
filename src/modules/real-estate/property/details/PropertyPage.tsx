import type {ReactNode} from "react";
import {useNavigate} from "@tanstack/react-router";

import Page from "#/components/Page.tsx";
import {Badge} from "#/components/ui/badge.tsx";
import {Button} from "#/components/ui/button.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card.tsx";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "#/components/ui/tabs.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";
import {
    Route as PropertyDetailsRoute
} from "#/routes/_authenticated/admin/real-estate/properties/$propertyId/route.tsx";

import {
    PROPERTY_DETAILS_TABS,
    PROPERTY_DETAILS_TAB_LABELS,
    PROPERTY_DETAILS_TAB_TO,
    type PropertyDetailsTab,
} from "./property-details.constants.ts";

type PropertyDetailsPageProps = {
    activeTab: PropertyDetailsTab
    children: ReactNode
}

const PropertyPage = ({
                                 activeTab,
                                 children,
                             }: PropertyDetailsPageProps) => {
    const navigate = useNavigate()
    const {propertyId} = PropertyDetailsRoute.useParams()
    const {data, isLoading, isFetching} = PropertyApiHook.useGetDetailedProperty(propertyId)

    return (
        <Page
            isLoading={isLoading}
            isFetching={isFetching}
            loading={{
                title: "Loading",
                description: `Fetching property (${propertyId})`,
            }}
            header={{
                avatar: data?.avatar,
                title: data?.name ?? "Property details",
                description: data?.description ?? "Property overview and configuration",
                actionView: (
                    <ButtonGroup>
                        <Button variant={"outline"} onClick={() => window.history.back()}>
                            Back
                        </Button>
                    </ButtonGroup>
                ),
            }}
        >
            <Card className="min-h-full w-full overflow-x-hidden shadow-none bg-transparent! backdrop-blur-none">
                <CardHeader className="gap-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1">
                            <CardTitle>{data?.name ?? "Property details"}</CardTitle>
                            <CardDescription>
                                Review the property summary, location, pricing, tenancy setup, and features.
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{data?.type ?? "TYPE_UNSET"}</Badge>
                            <Badge variant="outline">{data?.lifecycleStage ?? "STAGE_UNSET"}</Badge>
                            <Badge variant="outline">ID: {propertyId}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => {
                            void navigate({
                                to: PROPERTY_DETAILS_TAB_TO[value as PropertyDetailsTab] as any,
                                params: {propertyId} as any,
                                replace: true,
                            })
                        }}
                        className="gap-6 bg-card/50 backdrop-blur-2xl w-fit rounded-lg"
                    >
                        <TabsList variant="line" className="h-auto w-full flex-wrap justify-start rounded-none p-0">
                            {PROPERTY_DETAILS_TABS.map((tab) => (
                                <TabsTrigger key={tab} value={tab} className="flex-none px-1.5 py-2">
                                    {PROPERTY_DETAILS_TAB_LABELS[tab]}
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

export default PropertyPage
