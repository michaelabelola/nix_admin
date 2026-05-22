import {useMemo} from "react";
import {AppWindow, KeyRound, ShieldCheck, Webhook} from "lucide-react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx";
import {AccessTokenModel} from "@suiteonix/server";
import {AccessTokenRequest} from "@suiteonix/server";
import {AppRequest} from "@suiteonix/server";
import {AppsPage} from "#/modules/app/AppsPage.tsx";

function MetricCard({
    label,
    value,
    description,
    icon: Icon,
}: {
    label: string
    value: string
    description: string
    icon: typeof AppWindow
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                    <CardDescription>{label}</CardDescription>
                    <CardTitle className="text-2xl">{value}</CardTitle>
                </div>
                <div className="rounded-lg border p-2 text-muted-foreground">
                    <Icon className="size-5"/>
                </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
                {description}
            </CardContent>
        </Card>
    )
}

export function AppDashboardPage() {
    const appsQuery = AppRequest.useQueryApps({
        page: 0,
        size: 5,
        sort: [{field: "audit.createdDate", direction: "DESC"}],
    })
    const activeTokensQuery = AccessTokenRequest.useQueryAccessTokens({
        page: 0,
        size: 1,
        status: AccessTokenModel.AccessTokenStatus.ACTIVE,
    })
    const frozenTokensQuery = AccessTokenRequest.useQueryAccessTokens({
        page: 0,
        size: 1,
        status: AccessTokenModel.AccessTokenStatus.FROZEN,
    })

    const configuredWebhookCount = (appsQuery.data?.content ?? [])
        .filter((app) => !!app.webhook?.value)
        .length

    const headerContent = useMemo(() => (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
                label="Apps"
                value={String(appsQuery.data?.totalElements ?? 0)}
                description="Registered app integrations owned by this workspace."
                icon={AppWindow}
            />
            <MetricCard
                label="Active Tokens"
                value={String(activeTokensQuery.data?.totalElements ?? 0)}
                description="App access tokens currently marked ACTIVE."
                icon={KeyRound}
            />
            <MetricCard
                label="Frozen Tokens"
                value={String(frozenTokensQuery.data?.totalElements ?? 0)}
                description="App access tokens blocked without being deleted."
                icon={ShieldCheck}
            />
            <MetricCard
                label="Recent Webhooks"
                value={String(configuredWebhookCount)}
                description="Webhook-enabled apps in the current recent-app sample."
                icon={Webhook}
            />
        </div>
    ), [
        activeTokensQuery.data?.totalElements,
        appsQuery.data?.totalElements,
        configuredWebhookCount,
        frozenTokensQuery.data?.totalElements,
    ])

    return (
        <AppsPage
            routePath="/admin/apps/dashboard"
            title="Apps Dashboard"
            description="Monitor app integrations, generated tokens, and webhook coverage."
            initialRequest={{
                page: 0,
                size: 5,
                sort: [{field: "audit.createdDate", direction: "DESC"}],
            }}
            headerContent={headerContent}
        />
    )
}
