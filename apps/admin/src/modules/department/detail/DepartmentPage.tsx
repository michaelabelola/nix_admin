import type {ReactNode} from "react"
import {useNavigate} from "@tanstack/react-router"

import {Page} from "@suiteonix/components"
import {Badge} from "@suiteonix/ui"
import {Button} from "@suiteonix/ui"
import {ButtonGroup} from "@suiteonix/ui"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@suiteonix/ui"
import {Tabs, TabsList, TabsTrigger} from "@suiteonix/ui"
import {DepartmentRequest} from "@suiteonix/server"
import {
    DEPARTMENT_DETAILS_TAB_LABELS,
    DEPARTMENT_DETAILS_TAB_TO,
    DEPARTMENT_DETAILS_TABS,
    type DepartmentDetailsTab,
} from "#/modules/department/department-details.constants.ts"
import {Route as DepartmentDetailsRoute} from "#/routes/_authenticated/admin/departments/$departmentId/route.tsx"

export function DepartmentPage({
    activeTab,
    children,
}: {
    activeTab: DepartmentDetailsTab
    children: ReactNode
}) {
    const navigate = useNavigate()
    const {departmentId} = DepartmentDetailsRoute.useParams()
    const {data, isLoading, isFetching} = DepartmentRequest.useGetDepartment(departmentId)

    return (
        <Page
            isLoading={isLoading}
            isFetching={isFetching}
            loading={{
                title: "Loading",
                description: `Fetching department (${departmentId})`,
            }}
            header={{
                avatar: data?.avatar ?? null,
                title: data?.name || "Department details",
                description: data?.code ? `${data.code} · ${data.description || "No description"}` : "Department profile",
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
                            <CardTitle>{data?.name || "Department details"}</CardTitle>
                            <CardDescription>
                                Maintain department details and member assignments.
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{data?.code || "NO_CODE"}</Badge>
                            <Badge variant={data?.status === "ACTIVE" ? "success" : "outline"}>{data?.status || "STATUS_UNSET"}</Badge>
                            <Badge variant="secondary">{data?.type || "TYPE_UNSET"}</Badge>
                            <Badge variant="ghost" className="font-mono">ID: {departmentId}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => {
                            void navigate({
                                to: DEPARTMENT_DETAILS_TAB_TO[value as DepartmentDetailsTab] as any,
                                params: {departmentId} as any,
                                replace: true,
                            })
                        }}
                    >
                        <TabsList variant="line" className="h-auto w-full flex-wrap justify-start rounded-none p-0">
                            {DEPARTMENT_DETAILS_TABS.map((tab) => (
                                <TabsTrigger key={tab} value={tab} className="flex-none px-1.5 py-2">
                                    {DEPARTMENT_DETAILS_TAB_LABELS[tab]}
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
